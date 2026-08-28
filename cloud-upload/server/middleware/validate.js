export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.errors[0].message;
    return next(new ApiError(400, message));
  }
  next();
};