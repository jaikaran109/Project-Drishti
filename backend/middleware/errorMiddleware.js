const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  if (err.code === 11000) {
    const duplicateField = Object.keys(err.keyValue || err.keyPattern || {})[0];
    const fieldLabel =
      duplicateField === "phoneNumber"
        ? "phone number"
        : duplicateField === "email"
          ? "email"
          : "value";

    return res.status(409).json({
      message: `A record with this ${fieldLabel} already exists.`,
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: err.message,
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid resource id",
    });
  }

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      message: "Request body contains invalid JSON",
    });
  }

  return res.status(statusCode).json({
    message: err.message || "Something went wrong",
  });
};

module.exports = {
  notFound,
  errorHandler,
};
