const express = require("express");
const { getAllUsers, getUser } = require("../controllers/userController");
const {
  signup,
  login,
  restrictTo,
  protect,
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.route("/").get(protect, restrictTo("admin"), getAllUsers);

router.route("/:id").get(protect, restrictTo("admin"), getUser);

module.exports = router;
