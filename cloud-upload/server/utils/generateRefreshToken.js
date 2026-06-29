import jwt from "jsonwebtoken";
import { jwtRefreshConfig } from "../config/jwtRefreshConfig.js";

export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, jwtRefreshConfig.secret, {
    expiresIn: jwtRefreshConfig.expiresIn,
  });
};
