const express = require("express");

const { v4: uuid } = require('uuid');

const booksRoute = "/api/books/";

const book = {
  id: "string",
  title: "string",
  description: "string",
  authors: "string",
  favorite: "string",
  fileCover: "string",
  fileName: "string"
};
const books = [book, {...book, id: "string2"}];


const app = express();
app.use(express.json())

app.post("/api/user/login", (req, res) => {
  res.statusCode = 201;
  res.send({ id: 1, mail: "test@mail.ru" });
})
app.get(booksRoute, (req, res) => {
  res.send(books);
});
app.get(`${booksRoute}:id`, (req, res) => {
  const book = books.find(item => item.id === req.params.id);
  if (book) {
    res.send(book);
  } else {
    res.sendStatus(404);
  }
});

app.post(booksRoute, (req, res) => {
  const reqBook = req.body;
  const newBook = {...(reqBook || []), id: uuid()};

  books.push(newBook);
  res.send(newBook);
});


app.put(`${booksRoute}:id`, (req, res) => {
  const itemId = req.params.id;
  const reqBook = req.body;
  const indexOfBookInStore = books.findIndex(item => item.id  === itemId);

  if (indexOfBookInStore !== -1) {
    books[indexOfBookInStore] = {
      ...books[indexOfBookInStore],
      ...reqBook,
    }
    res.send(books[indexOfBookInStore]);
  } else {
    res.sendStatus(404);
  }
});
app.delete(`${booksRoute}:id`, (req, res) => {
  const itemId = req.params.id;
  const indexOfBookInStore = books.findIndex(item => item.id  === itemId);
  if (indexOfBookInStore !== -1) {
    books.splice(indexOfBookInStore, 1);
    res.send("OK");
  } else {
    res.sendStatus(404);
  }
})

app.listen(3000)