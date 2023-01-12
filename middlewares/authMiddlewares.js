const { User } = require("../models");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");

exports.protect = async (req, res, next) => {
  let token = null;
  try {
    // 1- fetch token from request headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2- check if token exist
    if (!token)
      return res
        .status(401)
        .json({ status: "error", error: "Please sign in!" });

    // 3- verify
    const {
      id: userId,
      iat: tokenIssuedAt, // by default tokenIssuedAt in second
    } = await promisify(jwt.verify)(token, process.env.JWT_SECRET); // converting callback function to async await method (promise)

    // 4- check if user exist in DB
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        status: "error",
        error: "User belonging to this token does not exist!",
      });
    }

    // 5- check if user does not change password after signing token
    let passwordChangedAt = user.passwordChangedAt; // milliseconds
    if (passwordChangedAt) {
      let isPasswordChangedAfter =
        passwordChangedAt.getTime() > tokenIssuedAt * 1000;
      if (isPasswordChangedAfter) {
        return res.status(401).json({
          status: "error",
          error: "Password has been changed, please login again!",
        });
      }
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(404).json({ status: "error", error: error.message });
  }
};

exports.restrictTo =
  (...roles) =>
  async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        status: "error",
        error: `You don't have access to perform this action!`,
      });
    }
    next();
  };
