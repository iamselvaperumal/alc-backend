const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const validateEnv = require("./config/validateEnv");

const app = express();

// Allowed origin for CORS
const allowedOrigin = "https://alc-project-jtm7.vercel.app";


app.use(cors({
  origin: "https://alc-project-jtm7.vercel.app",
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

// Body parser
app.use(express.json());


// ------------------------------
// GLOBAL LOGGER (ALL REQUESTS)
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
// CORS HANDLER
// ------------------------------
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", allowedOrigin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") {
    console.log("⚡ OPTIONS request handled");
    return res.sendStatus(204); // Preflight response
  }

  next();
});

// ------------------------------
// Body parser & cookies
// ------------------------------
//app.use(express.json());
app.use(cookieParser());

// ------------------------------
// Routes
// ------------------------------
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/api/departments", require("./routes/departmentRoutes"));
app.use("/api/employees", require("./routes/employeeRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));
app.use("/api/payroll", require("./routes/payrollRoutes"));
app.use("/api/production", require("./routes/productionRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/enquiry", require("./routes/enquiryRoutes"));
app.use("/api/awards", require("./routes/awardRoutes"));

// ------------------------------
// Root test route
// ------------------------------
app.get("/", (req, res) => {
  console.log("⚡ Root route hit");
  res.send("API is running...");
});

// ------------------------------
// 404 handler
// ------------------------------
app.use((req, res) => {
  console.log("⚠️ 404 HANDLER HIT:", req.method, req.url);
  res.status(404).json({ error: "Not Found" });
});

// ------------------------------
// Export app for Vercel
// ------------------------------
module.exports = app;
