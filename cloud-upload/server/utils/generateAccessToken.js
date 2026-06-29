import jwt from "jsonwebtoken";
import { jwtAccessTokenConfig } from "../config/jwtAccessTokenConfig.js";

export const generateAccessToken = (userId, email, role) => {
  return jwt.sign({ userId, email, role }, jwtAccessTokenConfig.secret, {
    expiresIn: jwtAccessTokenConfig.expiresIn,
  });
};
