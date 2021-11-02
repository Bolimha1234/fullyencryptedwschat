var io = require('socket.io-client');
const chalke = require('chalk'),

    chalk = new chalke.Instance({ enabled: true, level: 3 }),
    CryptoJS = require("crypto-js")
var socket = io("https://incog-server.contadecsgode.repl.co");

const readline = require('readline');
var emoji = require('node-emoji')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.stdoutMuted = false;

var id = "";
var buffer = "";
var password = ""


async function chat() {
    await rl.question(chalk.green("» "), async(answer) => {
        if (!answer) return chat()
        if (answer.toLocaleLowerCase() === '//clear') {
            console.clear()
            chat();
        } else if (answer.toLocaleLowerCase().startsWith('//nome')) {
            let newusername = answer.slice('//nome'.length).trim().split(/ +/g).join(" ")
            if (newusername === id) return chat()
            await socket.emit("message", CryptoJS.AES.encrypt(`O utilizador ${chalk.cyan(id)} mudou o nome para ${chalk.cyan(newusername)}`, password).toString());
            id = newusername
            chat();
        } else {
            buffer = emoji.emojify(`${chalk.cyan(id)}: ${answer}`);

            socket.emit("message", CryptoJS.AES.encrypt(buffer, password).toString());
            chat();
        }
    });
}

socket.on('connect', () => {
    rl.stdoutMuted = true;
    rl.question(`Password:`, (answer) => {
        password = answer;
        rl.stdoutMuted = false;
        rl.question(`What's your name? `, (answer) => {
            socket.emit("message", CryptoJS.AES.encrypt(`${chalk.green(answer)} has joined the chat.`, password).toString());
            id = answer;
            chat()

        });
    });

    rl._writeToOutput = function _writeToOutput(stringToWrite) {
        if (rl.stdoutMuted)
            rl.output.write("*");
        else
            rl.output.write(emoji.emojify(stringToWrite));
    };

    socket.on('msg', async function(data) {
        if (buffer !== CryptoJS.AES.decrypt(data, password).toString(CryptoJS.enc.Utf8)) {
            if (CryptoJS.AES.decrypt(data, password).toString(CryptoJS.enc.Utf8))
                console.log(CryptoJS.AES.decrypt(data, password).toString(CryptoJS.enc.Utf8))
            await chat();
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