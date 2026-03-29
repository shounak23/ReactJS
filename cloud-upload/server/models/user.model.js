import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, //password 123
  },
  { timestamps: true },
);
export const User = mongoose.model("User", userSchema);