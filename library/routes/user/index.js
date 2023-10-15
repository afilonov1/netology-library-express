const express = require("express");

const router = express.Router();

router.post("/login", (req, res, next) => {
    res.statusCode = 201;
    res.json({ id: 1, mail: "test@mail.ru" });
    next();
});

module.exports = router;