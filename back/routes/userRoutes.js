const express = require("express");
const { createUser, getAllUsers, getUserById, signup, login } = require("../controllers/userController");
const router = express.Router();

router.route("/").post(createUser);
router.route("/").get(getAllUsers);
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/:id").get(getUserById);

module.exports = router;
