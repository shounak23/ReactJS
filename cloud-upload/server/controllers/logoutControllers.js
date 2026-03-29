import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

export const logoutController = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(new ApiError(500, "Logout failed"));

    res.clearCookie("sid");

    return res.status(200).json(
      new ApiResponse(200, "Logged out successfully")
    );
  });
};