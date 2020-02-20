exports.errorHandler = (message, status, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode || 500;
  err.status = status || "error";
  return err;
};
