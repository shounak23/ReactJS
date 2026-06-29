import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  try {
    // Step 1 — Check access token exists
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Unauthorized - No token provided");
    }

    // Step 2 — Extract access token
    const accessToken = authHeader.split(" ")[1];

    // Step 3 — Verify access token (checks signature + expiry)
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    // Step 4 — Find user in DB
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      throw new ApiError(401, "Unauthorized - User no longer exists");
    }

    // Step 5 — Attach user to request
    req.user = user;
    console.log("user at auth", user)
    next();
  } catch (error) {
    // Handle jwt specific errors
    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Unauthorized - Token expired"));
    }
    if (error.name === "JsonWebTokenError") {
      return next(new ApiError(401, "Unauthorized - Invalid token"));
    }
    next(error);
  }
};
