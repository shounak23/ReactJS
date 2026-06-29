export const jwtAccessTokenConfig = {
  secret: process.env.ACCESS_TOKEN_SECRET,
  expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1h",
};