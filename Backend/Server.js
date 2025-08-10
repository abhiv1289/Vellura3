import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import fs from "fs";
import helmet from "helmet";
import { fileURLToPath } from "url";

// Importing routes
import AuthRoutes from "./Routes/AuthRoutes.js";
import MessageRoutes from "./Routes/MessageRoutes.js";
import ArticleRoutes from "./Routes/ArticleRoutes.js";
import FriendshipRoutes from "./Routes/FriendshipRoutes.js";
import UserRoutes from "./Routes/UserRoutes.js";
import TaskRoutes from "./Routes/TaskRoutes.js";
import MoodRoutes from "./Routes/MoodRoutes.js";
import SongsRoute from "./Routes/SongsRoute.js";
import UploadRoutes from "./Routes/UploadRoutes.js";

// Importing Configs, Utils & Socket
import { setupGoogleAuth } from "./Config/googleAuthConfig.js";
import connectDB from "./Config/DBConfig.js";
import { app, server } from "./socket/socket.js";
import { assignDailyTask } from "./Controllers/TaskController.js";

//Loading environment variables
dotenv.config();
const PORT = process.env.PORT || 8080;

//Initialize google authentication
setupGoogleAuth(app);

//start the server and connect to the database
const startServer = async () => {
  try {
    await connectDB();
    assignDailyTask();
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1); // Exit the process if the DB connection fails
  }
};
startServer();

//Global middlewares
app.use(helmet()); // Security middleware to set various HTTP headers
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//handling the cors issue
const allowedOrigins = ["http://localhost:5173"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy violation: Origin not allowed"));
      }
    },
    credentials: true,
  })
);

//Api routes
app.use("/api/auth", AuthRoutes);
app.use("/api/users", UserRoutes);
app.use("/api/articles", ArticleRoutes);
app.use("/api/friends", FriendshipRoutes);
app.use("/api/message", MessageRoutes);
app.use("/api/tasks", TaskRoutes);
app.use("/api/mood", MoodRoutes);
app.use("/api/songs", SongsRoute);
app.use("/api/upload", UploadRoutes);

//Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

//root endpointS
app.get("/", (req, res) => {
  res.send("Welcome to Mental-Health-app");
});
