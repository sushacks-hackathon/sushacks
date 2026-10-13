const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "/api/auth";

// Set authentication token and user info
export const setAuth = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("username", user?.username || "");
};

// Get authentication token
export const getToken = () => localStorage.getItem("token");

// Get username
export const getUsername = () => localStorage.getItem("username");

// Get user info
export const getUser = () => {
  const token = getToken();
  const userJson = localStorage.getItem("user");
  if (!token || !userJson) return null;

  try {
    return { token, user: JSON.parse(userJson) };
  } catch {
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => !!getToken();

// Logout - clear all auth data
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("user");
  localStorage.removeItem("loggedInUsername");
};

const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// parse server response and throw with message when not ok
const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
};

// --- Local fallback (client-only) auth helpers ---
const LOCAL_USERS_KEY = "local_users";

const getLocalUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || "[]");
  } catch {
    return [];
  }
};

const saveLocalUsers = (users) => {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
};

const createLocalToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  return btoa(JSON.stringify(payload));
};

const parseLocalToken = (token) => {
  try {
    const p = JSON.parse(atob(token));
    return p;
  } catch {
    return null;
  }
};

const localSignup = async (username, email, password) => {
  const users = getLocalUsers();
  const normalized = email.toLowerCase().trim();
  if (users.find((u) => u.email === normalized)) {
    throw new Error("Email already exists (local)");
  }
  const user = { id: Date.now().toString(), username, email: normalized, password };
  users.push(user);
  saveLocalUsers(users);
  const token = createLocalToken(user);
  return { token, user: { id: user.id, username: user.username, email: user.email } };
};

const localLogin = async (email, password) => {
  const users = getLocalUsers();
  const normalized = email.toLowerCase().trim();
  const user = users.find((u) => u.email === normalized);
  if (!user || user.password !== password) {
    throw new Error("Invalid email or password (local)");
  }
  const token = createLocalToken(user);
  return { token, user: { id: user.id, username: user.username, email: user.email } };
};

const localVerify = async () => {
  const token = getToken();
  if (!token) throw new Error("No token");
  const payload = parseLocalToken(token);
  if (!payload || payload.exp <= Date.now()) throw new Error("Token expired");
  return { valid: true, user: { id: payload.id, username: payload.username, email: payload.email } };
};

const localFetchMe = async () => {
  const token = getToken();
  if (!token) throw new Error("No token");
  const payload = parseLocalToken(token);
  if (!payload) throw new Error("Invalid token");
  return { user: { id: payload.id, username: payload.username, email: payload.email } };
};

// Signup API call
export const signup = async (username, email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    return await parseResponse(response);
  } catch (err) {
    // Network/backend unavailable — fallback to local client-side signup
    return await localSignup(username, email, password);
  }
};

// Login API call
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return await parseResponse(response);
  } catch (err) {
    // Network/backend unavailable — fallback to local client-side login
    return await localLogin(email, password);
  }
};

export const verifyAuth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/verify`, {
      headers: {
        ...authHeaders(),
      },
    });
    return await parseResponse(response);
  } catch (err) {
    // fallback to local verification
    return await localVerify();
  }
};

export const fetchMe = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/me`, {
      headers: {
        ...authHeaders(),
      },
    });
    return await parseResponse(response);
  } catch (err) {
    // fallback to local
    return await localFetchMe();
  }
};
