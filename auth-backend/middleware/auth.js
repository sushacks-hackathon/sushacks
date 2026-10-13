const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ message: "Access denied. Token missing." });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret_key"
    );
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;
