const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({
      message: "User created !!!",
      data: { newUser },
    });
  } catch (error) {
    res.status(400).json({
      message: "fail!!!",
      error: error,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      message: "Users fetched successfully",
      data: { users },
    });
  } catch (error) {
    res.status(400).json({
      message: "fail!!!",
      error: error,
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({
      message: "User fetched successfully",
      data: { user },
    });
  } catch (error) {
    res.status(400).json({
      message: "fail!!!",
      error: error,
    });
  }
};

exports.signup = async (req, res) => {
  try {
    const { name, age, email, password, confirm_Password } = req.body;
    const newUser = await User.create({ name, age, email, password, confirm_Password });
    res.status(201).json({ data: { newUser } });
  } catch (error) {
    res.status(400).json({
      message: "fail!!!",
      error: error,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "fail!!!", error: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "fail!!!", error: "User not found" });
    }
    const isPasswordValid = await user.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "fail!!!", error: "Invalid password" });
    }
    res.status(200).json({ message: "success!!!", data: { user } });
  } catch (error) {
    res.status(400).json({
      message: "fail!!!",
      error: error,
    });
  }
};

