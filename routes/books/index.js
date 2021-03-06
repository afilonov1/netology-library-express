const express = require("express");
const path = require("path");
const router = express.Router();
const { v4: uuid } = require('uuid');
const fs = require("node:fs");

const fileMulter = require("../../middleware/file");
const rewriteFileMulter = require("../../middleware/rewriteFile");

function getAllJSONBooks() {
    const books = [];
    const booksDir = path.join(__dirname, "../../public/books");
    const booksPaths = fs.readdirSync(booksDir)
        .filter(file => path.extname(file) === ".json");
    booksPaths.forEach(book => {
        const fileData = fs.readFileSync(path.join(booksDir, book));
        const data = JSON.parse(fileData.toString());
        books.push(data);
    });
    return books;
}

router.get("/", (req, res) => {
    const books = getAllJSONBooks();
    res.json(books);
});
router.get(`/:id`, (req, res) => {
    const books = getAllJSONBooks();
    const book = books.find(item => item.id === req.params.id);
    if (book) {
        res.json(book);
    } else {
        res.sendStatus(404);
    }
});

router.post("/", 
    fileMulter.single("book"),
    (req, res) => {
        const bookId = req.file?.filename?.slice(0, -5);
        if (req.file) {
            const {path} = req.file;
            const data = JSON.parse(fs.readFileSync(path));
            const newBook = {
                id: bookId,
                title: data.title || "",
                description: data.description || "",
                authors: data.authors || "",
                favorite: data.favorite || "",
                fileCover: data.fileCover || "",
                fileName: data.fileName || "",
                fileBook: data.fileBook || ""
            };
            fs.writeFileSync(path, JSON.stringify(newBook, null, 2));
            res.json({path});
            return;
        }
        const reqBook = req.body;
        const newBook = {
            id: bookId || uuid(),
            title: reqBook.title || "",
            description: reqBook.description || "",
            authors: reqBook.authors || "",
            favorite: reqBook.favorite || "",
            fileCover: reqBook.fileCover || "",
            fileName: reqBook.fileName || "",
            fileBook: reqBook.fileBook || ""
        };
        console.log(path.join(__dirname, "../../public/books", newBook.id + ".json"));
        fs.writeFile(path.join(__dirname, "../../public/books", newBook.id + ".json"), 
            JSON.stringify(newBook, null, 2), { flag: 'a+' }, err => {});

        res.json(newBook);
    }
);


router.put(`/:id`, 
    rewriteFileMulter.single("book"),
    (req, res) => {
        const books = getAllJSONBooks();
        const itemId = req.params.id;
        const reqBook = req.body || {};
        const indexOfBookInStore = books.findIndex(item => item.id  === itemId);
        console.log(books[indexOfBookInStore]);
        const prevBook = books[indexOfBookInStore] || [];

        if (indexOfBookInStore !== -1) {
            if (req.file) {
                const {path} = req.file;
                const data = JSON.parse(fs.readFileSync(path));
                const newBook = {
                    id: itemId,
                    title: data.title || "",
                    description: data.description || "",
                    authors: data.authors || "",
                    favorite: data.favorite || "",
                    fileCover: data.fileCover || "",
                    fileName: data.fileName || "",
                    fileBook: data.fileBook || ""
                };
                fs.writeFileSync(path, JSON.stringify(newBook, null, 2));
                res.json({path});
                return;
            }
            const newBook = {
                id: itemId,
                title: reqBook.title || prevBook.title,
                description: reqBook.description || prevBook.description,
                authors: reqBook.authors || prevBook.authors,
                favorite: reqBook.favorite || prevBook.favorite,
                fileCover: reqBook.fileCover || prevBook.fileCover,
                fileName: reqBook.fileName || prevBook.fileName,
                fileBook: reqBook.fileBook || prevBook.fileBook
            };
            console.log(newBook);
            fs.writeFile(path.join(__dirname, "../../public/books", newBook.id + ".json"), 
                JSON.stringify(newBook, null, 2), {}, err => {});
            res.json(newBook);
        } else {
            res.sendStatus(404);
        }
    }
);
router.delete(`/:id`, (req, res) => {
    const books = getAllJSONBooks();
    const itemId = req.params.id;
    const indexOfBookInStore = books.findIndex(item => item.id  === itemId);
    if (indexOfBookInStore !== -1) {
        fs.unlinkSync(path.join(__dirname, "../../public/books", itemId + ".json"));
        res.json("OK");
    } else {
        res.sendStatus(404);
    }
})

router.get(`/:id/download`, (req, res) => {
    const books = getAllJSONBooks();
    const id = req.params.id;
    console.log(id);
    const book = books.find(item => item.id === req.params.id);
    if (book) {
        const filePath = path.join(__dirname, `/../../public/books/${id}.json`);
        console.log(filePath);
        res.sendFile(filePath)
    } else {
        res.sendStatus(404);
    }
});

module.exports = router;