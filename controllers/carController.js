const Car = require("../models/carModel");
const APIFeatures = require("../utils/apiFeatures");

exports.getAllCars = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Car.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const cars = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: cars.length,
      data: {
        cars,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        car,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createCar = async (req, res) => {
  try {
    const newCar = await Car.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        car: newCar,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        car,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    await Car.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
exports.getLikes = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    const { likes } = car.likes;
    res.status(200).json({
      status: "succes",
      data: { likes: likes.length },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
exports.updateLikes = async (req, res) => {
  try {
    const car = Car.findByIdAndUpdate(
      req.params.id,
      { $push: { likes: req.body.userId } },
      { new: true, useFindAndModify: false }
    );
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.status(200).json({
      status: "success",
      data: {
        car,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
// exports.getCarStats = async (req, res) => {
//   try {
//     const stats = await Car.aggregate([
//       //   {
//       //     $match: { ratingsAverage: { $gte: 4.5 } },
//       //   },
//       //   {
//       //     $group: {
//       //       _id: { $toUpper: "$difficulty" },
//       //       numTours: { $sum: 1 },
//       //       numRatings: { $sum: "$ratingsQuantity" },
//       //       avgRating: { $avg: "$ratingsAverage" },
//       //       avgPrice: { $avg: "$price" },
//       //       minPrice: { $min: "$price" },
//       //       maxPrice: { $max: "$price" },
//       //     },
//       //   },
//       //   {
//       //     $sort: { avgPrice: 1 },
//       //   },
//     ]);

//     res.status(200).json({
//       status: "success",
//       data: {
//         stats,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: "fail",
//       message: err,
//     });
//   }
// };
