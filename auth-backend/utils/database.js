const fs = require("fs");
const path = require("path");

const usersFile = path.join(__dirname, "../data/users.json");

// Ensure data directory exists
const dataDir = path.join(__dirname, "../data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Read all users
const getUsers = () => {
  try {
    if (!fs.existsSync(usersFile)) {
      fs.writeFileSync(usersFile, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(usersFile, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading users:", err);
    return [];
  }
};

// Save users to file
const saveUsers = (users) => {
  try {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error("Error saving users:", err);
  }
};

// Find user by email
const normalizeEmail = (email) => email.trim().toLowerCase();

const findUserByEmail = (email) => {
  const users = getUsers();
  const normalizedEmail = normalizeEmail(email);
  return users.find((user) => user.email === normalizedEmail);
};

// Find user by id
const findUserById = (id) => {
  const users = getUsers();
  return users.find((user) => user.id === id);
};

// Create new user
const createUser = (username, email, hashedPassword) => {
  const users = getUsers();
  const newUser = {
    id: Date.now().toString(),
    username: username.trim(),
    email: normalizeEmail(email),
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
};

module.exports = {
  getUsers,
  saveUsers,
  findUserByEmail,
  findUserById,
  createUser,
  normalizeEmail,
};
