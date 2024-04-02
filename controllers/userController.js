const Car = require("../models/carModel");
const User = require("../models/userModel");

exports.getAllUsers = async function (req, res) {
  try {
    const users = await User.find();

    res.status(200).json({
      status: "succes",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
exports.getUser = async function (req, res) {
  try {
    const user = await Car.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
