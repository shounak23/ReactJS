import { Session } from "../models/session.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

export const logOutController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) throw new ApiError(401, "No refresh token found");

    // ✅ delete only THIS device session using refreshToken
    await Session.deleteOne({
      userId: req.user._id,
      refreshToken,
      isValid: true,
    });

    // clear refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json(
      new ApiResponse(200, "Logout successful", {
        username: req.user.username,
      }),
    );
  } catch (error) {
    return next(error);
  }
};