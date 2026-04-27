const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs"); // 👈 import here

// LOGIN
router.post("/login", async (req, res) => {
  try {
    // 1. Find user by email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json("User not found");
    }

    // 2. Compare password using bcrypt 👇
    const isMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json("Wrong password");
    }

    // 3. Success response
    res.json({
      message: "Login successful",
      token: "dummy-token",
      companyName: user.companyName,
      email: user.email
    });

  } catch (err) {
    res.status(500).json("Server error");
  }
});

module.exports = router;
router.post("/register", async (req, res) => {
  try {
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      companyName: req.body.companyName,
      industryType: req.body.industryType
    });

    await user.save();

    res.json("User registered");

  } catch (err) {
    res.status(500).json(err);
  }
});