const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use(express.json({ limit: "10kb" }));
app.use("/api", limiter);

app.use(mongoSanitize());

app.use(xss());

const carRouter = require("./rotes/carRoutes");
const userRouter = require("./rotes/userRoutes");

app.use(express.json());

app.use("/api/v1/cars", carRouter);
app.use("/api/v1/users", userRouter);
app.all("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

module.exports = app;
