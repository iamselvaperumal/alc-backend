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

// Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ CORS CONFIG
const allowedPreview = /^https:\/\/alc-project.*\.vercel\.app$/;

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow server-to-server (Postman, Vercel internal)
      if (!origin) {
        console.log("CORS allowed: no origin (server request)");
        return callback(null, true);
      }

      // Allow Vercel previews
      if (allowedPreview.test(origin)) {
        console.log("CORS allowed for preview:", origin);
        return callback(null, true);
      }

      // Allow production frontend (IMPORTANT)
      if (origin === "https://your-production-domain.vercel.app") {
        console.log("CORS allowed for prod:", origin);
        return callback(null, true);
      }

      console.warn("CORS blocked:", origin);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ IMPORTANT: Handle preflight manually (fixes controller not reached)
app.options("*", (req, res) => {
  res.status(200).end();
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

app.get("/", (req, res) => {
  res.send("ALC Manufacturing TEX API is running...");
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
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
  console.error("Error:", err);
  const statusCode = err.status || 500;
  const errorMessage = err.message || "Internal Server Error";

  res.status(statusCode).json({
    error: errorMessage,
  });
});

// Catch-all 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
