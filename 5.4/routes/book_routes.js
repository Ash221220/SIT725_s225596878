const express = require("express");
const router = express.Router();

const Controllers = require("../controllers");

router.get("/", Controllers.booksController.getAllBooks);
router.get("/:id", Controllers.booksController.getBookById);
router.post("/", Controllers.booksController.createBook);
router.put("/:id", Controllers.booksController.updateBook);

module.exports = router;