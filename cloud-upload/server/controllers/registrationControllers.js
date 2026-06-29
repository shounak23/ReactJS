import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";

export const registrationControllers = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) throw new ApiError(400, "All fields are required");

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new ApiError(409, "Email already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ username, email, password: hashedPassword });

    return res.status(201).json(
      new ApiResponse(201, "Registration successful", {
        id: user._id,
        email: user.email,
        username: user.username,
      })
    );
  } catch (error) {
    next(error);
  }
};