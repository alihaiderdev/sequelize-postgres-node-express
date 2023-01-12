exports.notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const splitAndTrim = (string, splitCharacter) =>
  string?.split(splitCharacter).map((error) => error.trim());

const errorFormatter = (error) => {
  const errorString = error.substring(error.indexOf(":") + 1).trim();
  const errorsArray = splitAndTrim(errorString, ",");

  let formattedArray = {};

  errorsArray.forEach((error) => {
    const [key, value] = splitAndTrim(error, ":");
    formattedArray[key] = value;
  });

  return formattedArray;
};

exports.errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    error,
    formateError: errorFormatter(error?.message),
    // stack: process.env.NODE_ENV === "production" ? null : error.stack,
  });
};

const errorHandler = (error, req, res, next) => {
  const errorStatus = error.statusCode || 500;
  res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: error.message || "Something went wrong",
    stack: process.env.NODE_ENV === "development" ? error.stack : {},
  });
};
