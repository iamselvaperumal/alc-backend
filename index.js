const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const validateEnv = require("./config/validateEnv");

const app = express();

const allowedOrigin = "https://alc-project-jtm7.vercel.app";

// ------------------------------
// //GLOBAL LOGGER (ALL REQUESTS)
// ------------------------------
app.use((req, res, next) => {
  console.log("\n==============================");
  console.log("➡️ Incoming Request");
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  console.log("Origin:", req.headers.origin);
  console.log("==============================");
  next();
});

// ------------------------------
// CORS HANDLER (manual for testing)
// ------------------------------
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", allowedOrigin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") {
    console.log("⚡ OPTIONS request handled");
    return res.sendStatus(204); // preflight response
  }

  next();
});

// ------------------------------
// Body parser for POST
// ------------------------------
app.use(express.json());

// ------------------------------
// POST TEST ROUTE
// ------------------------------
app.post("/", (req, res) => {
  console.log("⚡ POST request received");
  console.log("Body:", req.body);
  res.json({ message: "POST received!" });
});

// ------------------------------
// Start server
// ------------------------------
// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
/* --------------------------------------------------
   404 HANDLER
-------------------------------------------------- */
app.use((req, res) => {
  console.log("❓ 404 HANDLER HIT:", req.method, req.url);
  res.status(404).json({ error: "Not Found" });
});

// Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

//const app = require("../server"); // path to your main file
module.exports = app;
