import express from "express";
import userRoutes from "./routes/user.routes.js";
import filesRoutes from "./routes/file.routes.js";
import dotenv from "dotenv";
import MongoStore from "connect-mongo";
import session from "express-session";
import { DB_NAME } from "./constant.js";
import { isAuthenticated } from "./middleware/authMiddleware.js";
import cors from "cors";
import { ApiError } from "./utils/apiError.js";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.set("view engine", "ejs");
// app.set("views", path.join(process.cwd(), "views"));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// app.use(
//   session({
//     name: "sid",
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//       mongoUrl: `${process.env.MONGODB_URI}/${DB_NAME}`,
//       collectionName: "sessions",
//       ttl: 60 * 60,
//     }),
//     cookie: {
//       httpOnly: true,
//       maxAge: 1000 * 60 * 60,
//       secure: false,
//       sameSite: "lax",
//     },
//   }),
// );

app.use("/api/auth", userRoutes);
app.use("/api/files", isAuthenticated, filesRoutes);

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR →", err); // ← add this line
  const status = err.statusCode || 500;
  const message = err.message || "Internal server error";
  // return res.status(status).json(new ApiError(status, message));
  return res.status(status).json({
    statusCode: status,
    message,
    success: false,
  });
});

export default app;
