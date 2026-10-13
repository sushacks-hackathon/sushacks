const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth");
const {
  findUserByEmail,
  findUserById,
  createUser,
  normalizeEmail,
} = require("../utils/database");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

const createToken = (user) =>
  jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

// Sign up
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }
    const cleanedEmail = normalizeEmail(email);

    // Check if email already exists
    const existingUser = findUserByEmail(cleanedEmail);
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = createUser(username, cleanedEmail, hashedPassword);
    const token = createToken(user);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user
    const user = findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = createToken(user);

    res.json({
      token,
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/me", authMiddleware, (req, res) => {
  const user = findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  });
});

router.get("/verify", authMiddleware, (req, res) => {
  return res.json({
    valid: true,
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
    },
  });
});

router.post("/logout", authMiddleware, (req, res) => {
  // Stateless JWT logout handled on client by deleting token.
  return res.json({ message: "Logged out successfully" });
});

module.exports = router;
