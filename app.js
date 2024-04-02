const express = require("express");

const app = express();

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
