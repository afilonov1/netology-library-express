const multer = require("multer");
const {v4: uuid} = require("uuid");
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "public/books")
    },
    filename(req, file, cb) {
        console.log(file);
        cb(null, `${uuid()}.json`)
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype !== 'application/json') {
        cb(null, false);
    } else {
        cb(null, true);
    }
};
module.exports = multer({storage, fileFilter});