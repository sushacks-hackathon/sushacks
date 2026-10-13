const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();

// CORS configuration (env-driven allowlist)
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow non-browser requests (Postman, server-to-server)
      if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

// Ensure data directory exists
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize users.json if doesn't exist
const usersFile = path.join(dataDir, "users.json");
if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, JSON.stringify([], null, 2));
  console.log("✅ Created users.json database");
}

console.log("✅ File-based database initialized");

// Routes
app.use("/api/auth", require("./routes/auth"));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ message: "Backend is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Database: File-based (users.json)`);
});
