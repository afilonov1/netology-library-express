const express = require("express");

const userRoute = require("./routes/user");

const errorHandler = require("./routes/404");

const booksRoute = require("./routes/books");
const error404 = require("./middleware/error404");

const app = express();
app.use(express.json())
console.log(__dirname);
// app.use("/api/books", express.static(__dirname + "/public/img"));
app.use("/api/user", userRoute);
// app.use(errorHandler);

app.use("/api/books/", booksRoute);


// app.use(function(err, req, res, next) {
//   console.log(111);
//   res.status(500).send('Something broke!');
// });
app.use(error404);

const PORT = process.env.PORT || 3000;
app.listen(PORT);
