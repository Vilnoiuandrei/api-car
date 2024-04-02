const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User must have a name"],
  },
  role: {
    type: String,
    enum: ["user", "creator", "admin"],
    default: "user",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "The emial is not valid "],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same ",
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 14);

  this.passwordConfirm = undefined;
  next();
});
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
// userSchema.methods.createPasswordResetToken = async function () {
//   const resetToken = await bcrypt.hash(
//     Math.random().toString(36).substring(7),
//     10
//   );

//   this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

//   return resetToken;
// };
const User = mongoose.model("User", userSchema);

module.exports = User;
