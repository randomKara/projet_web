const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    default: "Fiction",
  },
  pages: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["À lire", "En cours", "Lu"],
    default: "À lire",
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book; 