require('dotenv').config()

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); 
const secretKey = process.env.JWT_SECRET_KEY;

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: req.body.role || 'Power User'
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      secretKey,
      { expiresIn: "1h" }
    );

    res
      .status(200)
      .json({
        token,
        userRole: user.role,
        userId: user._id,
        message: "Login successful",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }  
});

module.exports = router;
