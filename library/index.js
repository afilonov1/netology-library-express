const express = require("express");
const mongoose = require("mongoose");

const userRoute = require("./routes/user");
const errorHandler = require("./routes/404");
const booksRoute = require("./routes/books");
const indexRoute = require("./routes/indexRoute");
const error404 = require("./middleware/error404");

const app = express();
app.use(express.json())
app.set("view engine", "ejs");
app.use("/", indexRoute);
app.use("/api/user", userRoute);
app.get("/123", (req, res) => {
  console.log(req.query);
  res.sendStatus(200);
})
app.use("/api/books", booksRoute);

app.use(error404);


async function start(PORT, urlDB) {
  try {
    await mongoose.connect(urlDB);
    app.listen(PORT);
    console.log('server started at port', PORT);
  } catch (e) {
    console.log(e);
  }
}

const PORT = process.env.PORT || 3001;
const urlDB = process.env.urlDB;
start(PORT, urlDB);