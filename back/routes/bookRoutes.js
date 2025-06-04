const express = require("express");
const { 
  createBook, 
  getAllBooks, 
  getBookById, 
  getBooksByUserId, 
  updateBook, 
  deleteBook 
} = require("../controllers/bookController");
const router = express.Router();

router.route("/").post(createBook);
router.route("/").get(getAllBooks);
router.route("/user/:userId").get(getBooksByUserId);
router.route("/:id").get(getBookById);
router.route("/:id").put(updateBook);
router.route("/:id").delete(deleteBook);

module.exports = router; 