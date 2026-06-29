export const jwtRefreshConfig = {
  secret: process.env.JWT_SECERT,
  expiresIn: process.env.JWT_EXPIRES_IN || "1d",
};
