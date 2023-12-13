"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const session = require('express-session');
const mongoose = require("mongoose");
const passport = require('passport');
const socketIO = require("socket.io");
const http = require('http');
const userRoute = require("./routes/user");
const errorHandler = require("./routes/404");
const booksRoute = require("./routes/books");
const indexRoute = require("./routes/indexRoute");
const error404 = require("./middleware/error404");
const app = (0, express_1.default)();
const server = http.Server(app);
const io = socketIO(server);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded());
app.use(session({ secret: 'SECRET' }));
app.use(passport.session());
app.use(passport.initialize());
app.set("view engine", "ejs");
app.use("/", indexRoute);
app.use("/api/user", userRoute);
app.get("/123", (req, res) => {
    console.log(req.query);
    res.sendStatus(200);
});
app.use("/api/books", booksRoute);
app.use(error404);
function start(PORT, urlDB) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose.connect(urlDB);
            server.listen(PORT);
            console.log('server started at port', PORT);
        }
        catch (e) {
            console.log(e);
        }
    });
}
const PORT = +process.env.PORT || 3001;
const urlDB = process.env.urlDB;
start(PORT, urlDB);
io.on('connection', (socket) => {
    const { id } = socket;
    console.log(`Socket connected: ${id}`);
    console.log(socket.handshake);
    const { roomName } = socket.handshake.query;
    console.log(`Socket roomName: ${roomName}`);
    socket.join(roomName);
    socket.on('message-to-room', (msg) => {
        msg.type = `room: ${roomName}`;
        socket.to(roomName).emit('message-to-room', msg);
        socket.emit('message-to-room', msg);
    });
    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${id}`);
    });
});
