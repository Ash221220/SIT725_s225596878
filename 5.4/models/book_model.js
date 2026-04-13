const mongoose = require("mongoose");

const currentYear = new Date().getFullYear();

function isValidDecimalPrice(value) {
  try {
    const numericValue = parseFloat(value.toString());
    return Number.isFinite(numericValue) && numericValue > 0 && numericValue <= 9999.99;
  } catch (error) {
    return false;
  }
}

const BookSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, "Book id is required."],
      unique: true,
      immutable: true,
      trim: true,
      match: [/^b[a-zA-Z0-9_-]+$/, "Book id must start with 'b' and contain only letters, numbers, hyphens, or underscores."],
    },

    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
      minlength: [2, "Title must be at least 2 characters long."],
      maxlength: [120, "Title must be at most 120 characters long."],
    },

    author: {
      type: String,
      required: [true, "Author is required."],
      trim: true,
      minlength: [2, "Author must be at least 2 characters long."],
      maxlength: [80, "Author must be at most 80 characters long."],
    },

    year: {
      type: Number,
      required: [true, "Year is required."],
      min: [1450, "Year must be 1450 or later."],
      max: [currentYear, "Year cannot be in the future."],
      validate: {
        validator: Number.isInteger,
        message: "Year must be a whole number.",
      },
    },

    genre: {
      type: String,
      required: [true, "Genre is required."],
      trim: true,
      minlength: [3, "Genre must be at least 3 characters long."],
      maxlength: [40, "Genre must be at most 40 characters long."],
      enum: {
        values: [
          "Science Fiction",
          "Classic",
          "Historical Fiction",
          "Fantasy",
          "Mystery",
          "Thriller",
          "Romance",
          "Biography",
          "Non-Fiction",
          "Horror",
          "Adventure",
          "Other",
        ],
        message: "Genre is not valid.",
      },
    },

    summary: {
      type: String,
      required: [true, "Summary is required."],
      trim: true,
      minlength: [10, "Summary must be at least 10 characters long."],
      maxlength: [1000, "Summary must be at most 1000 characters long."],
    },

    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: [true, "Price is required."],
      validate: {
        validator: isValidDecimalPrice,
        message: "Price must be a valid positive amount not greater than 9999.99.",
      },
    },

    currency: {
      type: String,
      default: "AUD",
      enum: ["AUD"],
      immutable: true,
    },
  },
  {
    id: false,
    versionKey: false,
  }
);

module.exports = mongoose.model("Book", BookSchema);