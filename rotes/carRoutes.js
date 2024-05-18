const express = require("express");
const {
  getAllCars,
  createCar,
  getCar,
  updateCar,
  deleteCar,
  getLikes,
  updateLikes,
} = require("../controllers/carController");
const { restrictTo, protect } = require("../controllers/authController");

const router = express.Router();

// router.route("/car-stats").get(getCarStats);

router
  .route("/")
  .get(protect, getAllCars)
  .post(protect, restrictTo("admin", "creator"), createCar);

router
  .route("/:id")
  .get(protect, getCar)
  .patch(protect, restrictTo("admin", "creator"), updateCar)
  .delete(protect, restrictTo("admin"), deleteCar);
router.route("/likes/:id").get(protect, getLikes).patch(protect, updateLikes);
module.exports = router;
