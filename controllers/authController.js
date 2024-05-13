const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}
function createSendToken(user, statusCode, res) {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
}

exports.signup = async function (req, res, next) {
  const { name, email, password, passwordConfirm } = req.body;
  if (!name || !email || !password || !passwordConfirm) {
    return res.status(400).json({
      error: "Please provide a name,email,password and confirm passworld!",
    });
  }

  if (password.length < 8) {
    return res.status(401).json({
      error: "The password must have a minimum of 8 characters",
    });
  }
  if (password !== passwordConfirm) {
    return res.status(401).json({
      error: "The passwords are not the same ",
    });
  }
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(newUser, 201, res);
};

exports.login = async function (req, res, next) {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Please provide email and password!" });
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(401).json({ error: "Incorrect email or password" });
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
};

exports.protect = async function (req, res, next) {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      error: "You are not logged in! Please log in to get access.",
    });
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return res.status(401).json({
      error: "The user belonging to this token does no longer exist.",
    });
  }

  // // 4) Check if user changed password after the token was issued
  // if (currentUser.changedPasswordAfter(decoded.iat)) {
  //   return res.status(401).json({
  //     error: "User recently changed password! Please log in again.",
  //   });
  // }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
};

exports.restrictTo = function (...roles) {
  return function (req, res, next) {
    // roles ['admin', 'creator']. role='user'
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "You do not have permission to perform this action",
      });
    }

    next();
  };
};
