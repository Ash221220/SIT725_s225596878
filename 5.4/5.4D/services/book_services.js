const Book = require("../models/book_model");

const getAllBooks = async () => {
  return await Book.find({}).lean();
};

const getBookById = async (id) => {
  return await Book.findOne({ id }).lean();
};

const createBook = async (bookData) => {
  const book = new Book(bookData);
  await book.validate();
  const savedBook = await book.save();
  return savedBook.toObject();
};

const updateBook = async (id, updateData) => {
  const updatedBook = await Book.findOneAndUpdate(
    { id },
    { $set: updateData },
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  );
  return updatedBook ? updatedBook.toObject() : null;
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
};