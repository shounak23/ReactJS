import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { generateRefreshToken } from "../utils/generateRefreshToken.js";
import { generateAccessToken } from "../utils/generateAccessToken.js";
import { Session } from "../models/session.model.js";
import { logActivity } from "../utils/logActivity.js";

export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) throw new ApiError(400, "All fields are required");

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(401, "Invalid credentials");
    console.log("userDetails", user);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new ApiError(401, "Invalid credentials");

    // check user is already loggedIn from other device or not
    const alreadyLoggedIn = await Session.findOne({
      userId: user._id,
      isValid: true,
    });

    if (alreadyLoggedIn && process.env.MULTIDEVICE_LOGIN != 1) {
      await logActivity({
        userId: user._id,
        action: "failed_login",
        status: "failed",
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        details: "Multi-device login not allowed",
      });
      throw new ApiError(403, "Already logged in from another device");
    }

    // generate access token
    const accessToken = generateAccessToken(user._id, user.email, user.role);
    // Generate JWT token - refresh
    const refreshToken = generateRefreshToken(user._id);
    // Save session in DB  ← this is the new step
    await Session.create({
      userId: user._id,
      refreshToken,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
    // set Refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    // ✅ log successful login before sending response
    await logActivity({
      userId: user._id,
      action: "login",
      status: "success",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    return res.status(200).json(
      new ApiResponse(200, "Login successful", {
        id: user._id,
        email: user.email,
        username: user.username,
        accessToken,
      }),
    );
  } catch (error) {
    // ✅ log failed login in catch
    if (error.statusCode === 401) {
      await logActivity({
        userId: null, // user may not exist
        action: "failed_login",
        status: "failed",
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        details: error.message,
      });
    }
    next(error);
  }
};
