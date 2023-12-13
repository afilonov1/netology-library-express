import express, { Express } from "express";
const session = require('express-session')
const mongoose = require("mongoose");
const passport = require('passport')
const socketIO = require("socket.io");
const http = require('http');

const userRoute = require("./routes/user");
const errorHandler = require("./routes/404");
const booksRoute = require("./routes/books");
const indexRoute = require("./routes/indexRoute");
const error404 = require("./middleware/error404");



const app: Express = express();
const server = http.Server(app);
const io = socketIO(server);

app.use(express.json())
app.use(express.urlencoded());
app.use(session({ secret: 'SECRET'}));
app.use(passport.session())
app.use(passport.initialize())
app.set("view engine", "ejs");
app.use("/", indexRoute);
app.use("/api/user", userRoute);
app.get("/123", (req, res) => {
  console.log(req.query);
  res.sendStatus(200);
})
app.use("/api/books", booksRoute);
app.use(error404);


async function start(PORT: number, urlDB: string) {
  try {
    await mongoose.connect(urlDB);
    server.listen(PORT);
    console.log('server started at port', PORT);
  } catch (e) {
    console.log(e);
  }
}

const PORT = +process.env.PORT || 3001;
const urlDB = process.env.urlDB;
start(PORT, urlDB);


io.on('connection', (socket) => {
  const {id} = socket;
  console.log(`Socket connected: ${id}`);
  console.log(socket.handshake)
  const {roomName} = socket.handshake.query;
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