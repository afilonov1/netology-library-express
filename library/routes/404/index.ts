function errorHandler (err, req, res, next) {
    console.log("error")
    res.setStatus(404);
}

module.exports = errorHandler;