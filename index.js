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

console.log("🚀 Server booting...");

/* --------------------------------------------------
   GLOBAL REQUEST LOGGER (FIRST MIDDLEWARE)
-------------------------------------------------- */
app.use((req, res, next) => {
  console.log("\n==============================");
  console.log("➡️ Incoming Request");
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  console.log("Origin:", req.headers.origin);
  console.log("Referer:", req.headers.referer);
  console.log("==============================");
  next();
});

/* --------------------------------------------------
   BASIC MIDDLEWARE
-------------------------------------------------- */
app.use(express.json());
app.use(cookieParser());

console.log("✅ JSON + Cookies middleware loaded");

/* --------------------------------------------------
   CORS DEBUG
-------------------------------------------------- */
/* --------------------------------------------------
   CORS CONFIG (FIXED)
-------------------------------------------------- */
const allowedOrigin = "https://alc-project-jtm7.vercel.app";

app.use((req, res, next) => {
  console.log("test");
  res.header("Access-Control-Allow-Origin", allowedOrigin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    console.log("test 1");
    return res.sendStatus(200);
  }

  next();
});
console.log("✅ CORS middleware loaded");

app.use(cors());
/* --------------------------------------------------
   AFTER CORS CHECKPOINT
-------------------------------------------------- */
app.use((req, res, next) => {
  console.log("➡️ Passed CORS middleware");
  next();
});

/* --------------------------------------------------
   DATABASE DEBUG
-------------------------------------------------- */
let dbConnected = false;

const connectDB = async () => {
  if (dbConnected) {
    console.log("🟢 DB already connected (cached)");
    return;
  }

  console.log("🟡 Connecting to MongoDB...");

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    dbConnected = true;
    console.log("🟢 MongoDB Connected:", mongoose.connection.host);
  } catch (err) {
    console.log("🔴 MongoDB FAILED:", err.message);
    throw err;
  }
};

/* --------------------------------------------------
   DB MIDDLEWARE
-------------------------------------------------- */
app.use(async (req, res, next) => {
  console.log("➡️ Enter DB middleware");

  try {
    await connectDB();
    console.log("➡️ DB middleware DONE");
    next();
  } catch (error) {
    console.log("❌ DB middleware ERROR");
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Database connection flag to prevent multiple connections
// let dbConnected = false;

// // Lazy database connection function (connects only when needed)
// const connectDB = async () => {
//   if (dbConnected) return;

//   try {
//     if (!process.env.MONGO_URI) {
//       throw new Error("MONGO_URI environment variable is not set");
//     }

//     await mongoose.connect(process.env.MONGO_URI, {
//       // Serverless-friendly options
//       serverSelectionTimeoutMS: 5000,
//       socketTimeoutMS: 45000,
//     });

//     dbConnected = true;
//     console.log(`MongoDB Connected: ${mongoose.connection.host}`);
//   } catch (error) {
//     console.error(`Database Connection Error: ${error.message}`);
//     dbConnected = false;
//     throw error; // Re-throw to handle in middleware
//   }
// };

// Middleware to connect to DB before each request
// app.use(async (req, res, next) => {
//   try {
//     await connectDB();
//     next();
//   } catch (error) {
//     res.status(500).json({
//       error: "Database connection failed",
//       message:
//         process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// });

/* --------------------------------------------------
   BEFORE ROUTES CHECKPOINT
-------------------------------------------------- */
app.use((req, res, next) => {
  console.log("➡️ Reached BEFORE ROUTES");
  next();
});

/* --------------------------------------------------
   ROOT TEST
-------------------------------------------------- */
app.get("/", (req, res) => {
  console.log("🏠 Root route hit");
  res.send("API is running...");
});

/* --------------------------------------------------
   ROUTE DEBUG WRAPPER
-------------------------------------------------- */
function routeLogger(name, router) {
  return (req, res, next) => {
    console.log(`📦 Entering Route Group: ${name}`);
    router(req, res, next);
  };
}


// Routes
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.log("💥 ERROR HANDLER TRIGGERED");
  console.log("Error:", err.message);

  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Credentials", "true");

  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

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
