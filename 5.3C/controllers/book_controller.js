const booksService = require('../services/book_services');

const getAllBooks = async (req, res) => {
    try {
        const books = await booksService.getAllBooks();
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getBookById = async (req, res) => {
    try {
        const book = await booksService.getBookById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllBooks,
    getBookById
};