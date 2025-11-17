import "reflect-metadata";
import express from "express";
import cookieParser from "cookie-parser";
import { AppDataSource } from "./config/data-source";
import userRoutes from "./routes/userRoutes";

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Jewelry Backend API Running!");
});

app.use("/api/users", userRoutes);

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
