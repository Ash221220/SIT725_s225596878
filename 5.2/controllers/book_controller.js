const booksService = require('../services/book_services');

const getAllBooks = (req, res) => {
    const books = booksService.getAllBooks();
    res.json(books);
};

const getBookById = (req, res) => {
    const id = req.params.id;
    const book = booksService.getBookById(id);
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
};

module.exports = {
    getAllBooks,
    getBookById
};