const express = require("express");

const fileMulter = require("../../middleware/file");
const rewriteFileMulter = require("../../middleware/rewriteFile");
const Book = require("../../models/book-model");

const router = express.Router();

router.get("/", async (req, res) =>  {
    try {
        const books = await Book.find();
        res.render("books/index", {books});
    } catch (e) {
        res.status(500).json(e);
    }
});
router.get(`/add`, (req, res) => {
    res.render("books/add");
});
router.get(`/update/:id`, async (req, res) => {
    try {
        const {id} = req.params;
        const book = await Book.findById(id);

        if (book) {
            console.log(book)
            res.render("books/update", {book});
        } else {
            res.redirect("/api/books");
        }
    } catch (e) {
        res.status(500).json(e);
    }
});


router.get("/create", 
    fileMulter.single("book"),
    async (req, res) => {
        try {
            const reqBook = req.query;
        
            const newBook = new Book({
                title: reqBook.title || "",
                description: reqBook.description || "",
                authors: reqBook.authors || "",
                favorite: reqBook.favorite || "",
                fileCover: reqBook.fileCover || "",
                fileName: reqBook.fileName || "",
            });
    
            await newBook.save();
            res.redirect("/api/books/overview/" + newBook.id);
        } catch (e) {
            res.status(500).json(e);
        }
    }
);
const COUNTER_SERVICE_URL = process.env.COUNTER_SERVICE_URL || "http://localhost:3000";
async function incrCounter(id) {
    try {
        await fetch(`${COUNTER_SERVICE_URL}/counter/${id}/incr`, { method: "POST" });
    } catch {
        console.log("unable INCR");
    }
}
async function getCounter(id) {
    let result = {};
    try {
        const response = await fetch(`${COUNTER_SERVICE_URL}/counter/${id}`);
        const result = await response.json();
        return result.status ? result.count : 0;

    } catch (e) {
        console.log("unable get CNT");
    }
    return 1;
}
router.get(`/overview/:id`, async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        
        if (book) {
            await incrCounter(id);
            const viewCount = await getCounter(id);
            // res.json(book);
            res.render("books/overview", {book, viewCount});
        } else {
            res.sendStatus(404);
        }
    } catch (e) {
        res.status(500).json(e);
    }
});

router.get(`/updaterequest/:id`, 
    rewriteFileMulter.single("book"),
    async (req, res) => {
        try {
            const {id} = req.params;
            const reqBook = req.query || {};
            const prevBook = Book.findById(id);
            if (!prevBook) return res.sendStatus(404);
            const newBook = {
                title: reqBook.title || prevBook.title,
                description: reqBook.description || prevBook.description,
                authors: reqBook.authors || prevBook.authors,
                favorite: reqBook.favorite || prevBook.favorite,
                fileCover: reqBook.fileCover || prevBook.fileCover,
                fileName: reqBook.fileName || prevBook.fileName,
                fileBook: reqBook.fileBook || prevBook.fileBook
            };
            await Book.findByIdAndUpdate(id, newBook);
            res.redirect("/api/books/overview/" + id);
        } catch (e) {
            res.status(500).json(e);
        }
    }
);
router.post(`/delete/:id`, async (req, res) => {
    try {
        const {id} = req.params;
        await Book.findByIdAndDelete(id)
        res.redirect("/api/books");
    } catch (e) {
        res.status(500).json(e);
    }
})

router.get(`/:id/download`, async (req, res) => {
    try {
        const id = req.params.id;
        const book = books.findById(id);
        if (book) {
            res.sendFile(book);
        } else {
            res.sendStatus(404);
        }
    } catch (e) {
        res.status(500).json(e);
    }
});

module.exports = router;
