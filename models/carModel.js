const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  manufacturer: {
    type: String,
    required: [true, "A car must have a manufacturer"],
  },
  model: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
    unique: true,
    required: [true, "A car must have variant"],
  },

  year: {
    type: Number,
    required: true,
  },
  horsePower: Number,
  zeroToHundred: Number,
  topSpeed: Number,
  price: {
    type: Number,
  },
  description: String,
  imageCover: String,
  images: [String],
  rating: {
    type: Number,
    default: 0,
  },
});

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
