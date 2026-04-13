const booksService = require("../services/book_services");

const ALLOWED_WRITE_FIELDS = [
  "id",
  "title",
  "author",
  "year",
  "genre",
  "summary",
  "price",
];

function getUnknownFields(body, allowedFields) {
  return Object.keys(body).filter((key) => !allowedFields.includes(key));
}

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

const createBook = async (req, res) => {
  try {
    const unknownFields = getUnknownFields(req.body, ALLOWED_WRITE_FIELDS);

    if (unknownFields.length > 0) {
      return res.status(400).json({
        message: `Unknown field(s) not allowed: ${unknownFields.join(", ")}`,
      });
    }

    const createdBook = await booksService.createBook(req.body);
    return res.status(201).json(createdBook);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Duplicate book id. A book with this id already exists.",
      });
    }

    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: Object.values(err.errors).map((e) => e.message),
      });
    }

    return res.status(500).json({ message: err.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const unknownFields = getUnknownFields(req.body, ALLOWED_WRITE_FIELDS);

    if (unknownFields.length > 0) {
      return res.status(400).json({
        message: `Unknown field(s) not allowed: ${unknownFields.join(", ")}`,
      });
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "id")) {
      return res.status(400).json({
        message: "Book id is immutable and cannot be changed.",
      });
    }

    const requiredUpdateFields = ["title", "author", "year", "genre", "summary", "price"];
    const missingFields = requiredUpdateFields.filter(
      (field) => !Object.prototype.hasOwnProperty.call(req.body, field)
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required field(s) for update: ${missingFields.join(", ")}`,
      });
    }

    const updatedBook = await booksService.updateBook(req.params.id, req.body);

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(updatedBook);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: Object.values(err.errors).map((e) => e.message),
      });
    }

    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
};