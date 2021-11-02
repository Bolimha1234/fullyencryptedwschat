var io = require("socket.io-client");
const chalke = require("chalk"),
    chalk = new chalke.Instance({ enabled: !0, level: 3 }),
    CryptoJS = require("crypto-js");
var socket = io("https://incog-server.contadecsgode.repl.co");
const readline = require("readline");
var emoji = require("node-emoji");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.stdoutMuted = !1;
var id = "",
    buffer = "",
    password = "";
async function chat() { await rl.question(chalk.green("» "), async e => { if (!e) return chat(); if ("//clear" === e.toLocaleLowerCase()) console.clear(), chat();
        else if (e.toLocaleLowerCase().startsWith("//nome")) { let t = e.slice("//nome".length).trim().split(/ +/g).join(" "); if (t === id) return chat();
            await socket.emit("message", CryptoJS.AES.encrypt(`O utilizador ${chalk.cyan(id)} mudou o nome para ${chalk.cyan(t)}`, password).toString()), id = t, chat() } else buffer = emoji.emojify(`${chalk.cyan(id)}: ${e}`), socket.emit("message", CryptoJS.AES.encrypt(buffer, password).toString()), chat() }) }
socket.on("connect", () => { rl.stdoutMuted = !0, rl.question("Password:", e => { password = e, rl.stdoutMuted = !1, rl.question("What's your name? ", e => { socket.emit("message", CryptoJS.AES.encrypt(`${chalk.green(e)} has joined the chat.`, password).toString()), id = e, chat() }) }), rl._writeToOutput = function(e) { rl.stdoutMuted ? rl.output.write("*") : rl.output.write(emoji.emojify(e)) }, socket.on("msg", async function(e) { buffer !== CryptoJS.AES.decrypt(e, password).toString(CryptoJS.enc.Utf8) && (CryptoJS.AES.decrypt(e, password).toString(CryptoJS.enc.Utf8) && console.log(CryptoJS.AES.decrypt(e, password).toString(CryptoJS.enc.Utf8)), await chat()) }) }), process.on("exit", () => { "" !== id && "" !== id && socket.emit("message", CryptoJS.AES.encrypt(`${chalk.red(id)} has leaved the chat.`, password).toString()), process.exit() }), process.on("SIGINT", () => { "" !== id && socket.emit("message", CryptoJS.AES.encrypt(`${chalk.red(id)} has leaved the chat.`, password).toString()), process.exit() }), process.on("SIGUSR1", () => { "" !== id && socket.emit("message", CryptoJS.AES.encrypt(`${chalk.red(id)} has leaved the chat.`, password).toString()), process.exit() }), process.on("SIGUSR2", () => { "" !== id && socket.emit("message", CryptoJS.AES.encrypt(`${chalk.red(id)} has leaved the chat.`, password).toString()), process.exit() }), process.on("uncaughtException", () => { "" !== id && socket.emit("message", CryptoJS.AES.encrypt(`${chalk.red(id)} has leaved the chat.`, password).toString()), process.exit() }), process.on("SIGTERM", () => { "" !== id && socket.emit("message", CryptoJS.AES.encrypt(`${chalk.red(id)} has leaved the chat.`, password).toString()), process.exit() });