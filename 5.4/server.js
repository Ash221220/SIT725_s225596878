const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = 3000;

mongoose
  .connect("mongodb://127.0.0.1:27017/booksDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const booksRoutes = require("./routes/book_routes");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/books", booksRoutes);

app.get("/api/integrity-check42", (req, res) => {
  res.status(204).send();
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});