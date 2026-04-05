import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

export const  loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) throw new ApiError(400, "All fields are required");

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(401, "Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new ApiError(401, "Invalid credentials");

    req.session.user = { id: user._id, email: user.email, username: user.username };

    return res.status(200).json(
      new ApiResponse(200, "Login successful", {
        id: user._id,
        email: user.email,
        username: user.username,
      })
    );
  } catch (error) {
    next(error);
  }
};