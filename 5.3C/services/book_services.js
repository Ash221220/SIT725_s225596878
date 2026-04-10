const Book = require('../models/book_model');

const getAllBooks = async () => {
  return await Book.find({}).lean();
};

const getBookById = async (id) => {
  return await Book.findOne({ id }).lean();
};

module.exports = {
  getAllBooks,
  getBookById
};