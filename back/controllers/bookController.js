const Book = require("../models/bookModel");

exports.createBook = async (req, res) => {
  try {
    const newBook = await Book.create(req.body);
    res.status(201).json({
      message: "Book created !!!",
      data: { newBook },
    });
  } catch (error) {
    res.status(400).json({
      message: "fail!!!",
      error: error,
    });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json({
      message: "Books fetched successfully",
      data: { books },
    });
  } catch (error) {
    res.status(400).json({
      message: "fail!!!",
      error: error,
    });
  }
};

exports.getBooksByUserId = async (req, res) => {
  try {
    const books = await Book.find({ userId: req.params.userId });
    res.status(200).json({
      message: "User books fetched successfully",
      data: { books },
    });
  } catch (error) {
    res.status(400).json({
      message: "fail!!!",
      error: error,
    });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.status(200).json({
      message: "Book fetched successfully",
      data: { book },
    });
  } catch (error) {
    res.status(400).json({
      message: "fail!!!",
      error: error,
    });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({
      message: "Book updated successfully",
      data: { book },
    });
  } catch (error) {
    res.status(400).json({
      message: "fail!!!",
      error: error,
    });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "fail!!!",
      error: error,
    });
  }
}; 