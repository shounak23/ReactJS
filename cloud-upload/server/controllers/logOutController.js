import { Session } from "../models/session.model.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const logOutController = async (req, res, next) => {
  try {
    await Session.findOneAndUpdate(
      { userId: req.user._id, isValid: true }, // find session
      { isValid: false }, // update this field
    );
    // do this if audit log is not required
    await Session.deleteOne({ userId: req.user._id });
    // clear refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return res.status(200).json(
      new ApiResponse(200, "LogOut successful", {
        id: req.user.username,
      }),
    );
  } catch (error) {
    return next(error);
  }
};
