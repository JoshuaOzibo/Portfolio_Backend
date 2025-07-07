import dotenv from "dotenv";
import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
// import authRouter from "../route/auth_Router.js";
import projectRoute from "./route/project_Router.js";
import connectDb from "./DataBase/mongo_db.js";
import authRouter from "./route/auth_Router.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import skillRoute from "./route/skill_Route.js";
import socialRoute from "./route/social_Router.js";
import experienceRoute from "./route/experience_Route.js";
import getAllDbData from "./route/get_all_data_Route.js";

const app = express();
dotenv.config();

// Security Middleware
app.use(helmet());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(morgan("dev"));

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Start server after database connection
let isDbConnected = false;

app.use(async (req, res, next) => {
  if (!isDbConnected) {
    try {
      await connectDb();
      isDbConnected = true;
    } catch (err) {
      console.error("MongoDB connection error:", err);
      return res.status(500).json({ error: "Database connection failed" });
    }
  }
  next();
});

app.get("/", (req, res) => {
  res.status(200).send("API is running 🚀");
});

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/projects", projectRoute);
app.use("/api/v1/skills", skillRoute);
app.use("/api/v1/socials", socialRoute);
app.use("/api/v1/experiences", experienceRoute);
app.use("/api/v1/users", getAllDbData);


// Handle undefined routes
app.use(notFound);

// Global error handler
app.use(errorHandler);

// const PORT = process.env.PORT || 8000;

export default serverless(app);
