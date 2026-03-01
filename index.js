const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const validateEnv = require("./config/validateEnv");


dotenv.config();

// Validate environment variables BEFORE doing anything else
try {
  validateEnv();
} catch (error) {
  console.error("❌ Validation Error");
  console.error(error.message);
  process.exit(1);
}


const app = express();

// Allowed origin for CORS
const allowedOrigin = "https://alc-project-jtm7.vercel.app";


app.use(cors({
  origin: "https://alc-testing.netlify.app",
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


// Database connection flag to prevent multiple connections
let dbConnected = false;

// Lazy database connection function (connects only when needed)
const connectDB = async () => {
  if (dbConnected) return;

  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not set");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      // Serverless-friendly options
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    dbConnected = true;
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    dbConnected = false;
    throw error; // Re-throw to handle in middleware
  }
};

// Middleware to connect to DB before each request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({
      error: "Database connection failed",
      message:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
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
    return res.sendStatus(200); // Preflight response
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
