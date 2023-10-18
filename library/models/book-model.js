const { model, Schema } = require('mongoose');

const bookSchema = new Schema({
  title: String,
  description: String,
  authors: String,
  favorite: String,
  fileCover: String,
  fileName: String,
});

module.exports = model('Book', bookSchema);