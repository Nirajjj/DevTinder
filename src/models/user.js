const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 100,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 100,
    },
    email: {
      type: String,
      uniqe: true,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 100,
    },
    age: {
      type: Number,
      minLength: 18,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    about: {
      type: String,
    },
    photoUrl: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid url");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);
userSchema.methods.getJwt = function () {
  const user = this;
  const token = jwt.sign({ id: user._id }, "devTinderByNirajParab", {
    expiresIn: "7d",
  });
  return token;
};
userSchema.methods.validatePassword = async function (passwordTypeBtUser) {
  const passwordHash = this.password;
  isPasswordValid = await bcrypt.compare(passwordTypeBtUser, passwordHash);
  return isPasswordValid;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
