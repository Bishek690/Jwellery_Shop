import "reflect-metadata";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { AppDataSource } from "./config/data-source";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import orderRoutes from "./routes/orderRoutes";

require("dotenv").config();

const app = express();

// CORS configuration for frontend integration
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    process.env.FRONTEND_URL || "http://localhost:3000"
  ],
  credentials: true, // Allow cookies to be sent
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Jewelry Backend API Running!",
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// API status endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    database: AppDataSource.isInitialized ? "connected" : "disconnected",
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/orders", orderRoutes);

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Global error handler:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === "development" ? err : {}
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl
  });
});

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || "localhost";

AppDataSource.initialize()
  .then(() => {
    if (AppDataSource.isInitialized) {
      console.log("Connected to database");
      app.listen(PORT, () => {
        console.log(`Server started on http://${HOST}:${PORT}`);
      });
    } else {
      console.error("Database initialization succeeded but DataSource is not initialized");
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("Database connection error:", error);
    process.exit(1);
  });
