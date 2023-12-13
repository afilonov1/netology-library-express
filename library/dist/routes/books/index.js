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
const express = require("express");
const fileMulter = require("../../middleware/file");
const rewriteFileMulter = require("../../middleware/rewriteFile");
const Book = require("../../models/book-model");
const router = express.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield Book.find();
        res.render("books/index", { books });
    }
    catch (e) {
        res.status(500).json(e);
    }
}));
router.get(`/add`, (req, res) => {
    res.render("books/add");
});
router.get(`/update/:id`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const book = yield Book.findById(id);
        if (book) {
            console.log(book);
            res.render("books/update", { book });
        }
        else {
            res.redirect("/api/books");
        }
    }
    catch (e) {
        res.status(500).json(e);
    }
}));
router.get("/create", fileMulter.single("book"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield newBook.save();
        res.redirect("/api/books/overview/" + newBook.id);
    }
    catch (e) {
        res.status(500).json(e);
    }
}));
const COUNTER_SERVICE_URL = process.env.COUNTER_SERVICE_URL || "http://localhost:3000";
function incrCounter(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fetch(`${COUNTER_SERVICE_URL}/counter/${id}/incr`, { method: "POST" });
        }
        catch (_a) {
            console.log("unable INCR");
        }
    });
}
function getCounter(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = {};
        try {
            const response = yield fetch(`${COUNTER_SERVICE_URL}/counter/${id}`);
            const result = yield response.json();
            return result.status ? result.count : 0;
        }
        catch (e) {
            console.log("unable get CNT");
        }
        return 1;
    });
}
router.get(`/overview/:id`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const book = yield Book.findById(id);
        if (book) {
            yield incrCounter(id);
            const viewCount = yield getCounter(id);
            // res.json(book);
            res.render("books/overview", { book, viewCount });
        }
        else {
            res.sendStatus(404);
        }
    }
    catch (e) {
        res.status(500).json(e);
    }
}));
router.get(`/updaterequest/:id`, rewriteFileMulter.single("book"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const reqBook = req.query || {};
        const prevBook = Book.findById(id);
        if (!prevBook)
            return res.sendStatus(404);
        const newBook = {
            title: reqBook.title || prevBook.title,
            description: reqBook.description || prevBook.description,
            authors: reqBook.authors || prevBook.authors,
            favorite: reqBook.favorite || prevBook.favorite,
            fileCover: reqBook.fileCover || prevBook.fileCover,
            fileName: reqBook.fileName || prevBook.fileName,
            fileBook: reqBook.fileBook || prevBook.fileBook
        };
        yield Book.findByIdAndUpdate(id, newBook);
        res.redirect("/api/books/overview/" + id);
    }
    catch (e) {
        res.status(500).json(e);
    }
}));
router.post(`/delete/:id`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield Book.findByIdAndDelete(id);
        res.redirect("/api/books");
    }
    catch (e) {
        res.status(500).json(e);
    }
}));
router.get(`/:id/download`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const book = books.findById(id);
        if (book) {
            res.sendFile(book);
        }
        else {
            res.sendStatus(404);
        }
    }
    catch (e) {
        res.status(500).json(e);
    }
}));
module.exports = router;
