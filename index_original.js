var io = require('socket.io-client');
const chalke = require('chalk'),

    chalk = new chalke.Instance({ enabled: true, level: 3 }),
    CryptoJS = require("crypto-js")
var socket = io("https://incog-server.contadecsgode.repl.co");

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


var id = "";
var buffer = "";
var password = ""

function chat() {
    rl.question(chalk.green("» "), (answer) => {
        if (answer.toLocaleLowerCase() === '//clear') {
            console.clear()
            chat();
        } else {
            buffer = `${chalk.cyan(id)}: ${answer}`;
            socket.emit("message", CryptoJS.AES.encrypt(buffer, password).toString());
            chat();
        }
    });
}

socket.on('connect', () => {
    rl.question(`Password:`, (answer) => {
        password = answer;
        rl.question(`What's your name? `, (answer) => {
            socket.emit("message", CryptoJS.AES.encrypt(`${chalk.green(answer)} has joined the chat.`, password).toString());
            id = answer;
            chat()

        });
    });



    socket.on('msg', function(data) {
        if (buffer !== CryptoJS.AES.decrypt(data, password).toString(CryptoJS.enc.Utf8)) {
            console.log('\n' + CryptoJS.AES.decrypt(data, password).toString(CryptoJS.enc.Utf8));
            chat();
        }
    });

})

process.on("exit", () => {
    if (id !== "") { if (id !== "") { socket.emit("message", CryptoJS.AES.encrypt(`${chalk.red(id)} has leaved the chat.`, password).toString()); } }
    process.exit()
});
process.on("SIGINT", () => {
    if (id !== "") { socket.emit("message", CryptoJS.AES.encrypt(`${chalk.red(id)} has leaved the chat.`, password).toString()); }
    process.exit()
});
process.on("SIGUSR1", () => {
    if (id !== "") { socket.emit("message", CryptoJS.AES.encrypt(`${chalk.red(id)} has leaved the chat.`, password).toString()); }
    process.exit()
});
process.on("SIGUSR2", () => {
    if (id !== "") { socket.emit("message", CryptoJS.AES.encrypt(`${chalk.red(id)} has leaved the chat.`, password).toString()); }
    process.exit()
});
process.on("uncaughtException", () => {
    if (id !== "") { socket.emit("message", CryptoJS.AES.encrypt(`${chalk.red(id)} has leaved the chat.`, password).toString()); }
    process.exit()
});
process.on("SIGTERM", () => {
    if (id !== "") { socket.emit("message", CryptoJS.AES.encrypt(`${chalk.red(id)} has leaved the chat.`, password).toString()); }
    process.exit()
});