const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {


  console.log("PUT /api/users/:id - ID:", req.params.id);
  console.log("PUT /api/users/:id - req.user:", req.user);
  console.log("PUT /api/users/:id - req.body:", req.body);

  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update user role" });
  }
});

module.exports = router;