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
    required: [true, "A car must have variant"],
  },

  year: {
    type: Number,
    required: true,
  },
  horsePower: Number,
  zeroToHundred: Number,
  topSpeed: Number,
  engineDisplacement: Number,
  engineType: String,
  price: {
    type: Number,
  },
  description: String,
  imageCover: String,
  images: [String],
  likes: [String],
});

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
