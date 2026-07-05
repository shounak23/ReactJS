export const jwtRefreshConfig = {
  secret: process.env.REFRESH_TOKEN_SECRET,
  expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "1d",
};
