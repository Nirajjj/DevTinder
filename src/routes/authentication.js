const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    const userData = await user.save();
    var token = await user.getJwt();
    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      // maxAge: 7 * 24 * 60 * 60 * 1000,
      // httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    // res.json({ message: "login success", data: user });

    res.json({ message: "user added successfully!", data: userData });
  } catch (error) {
    res.status(400).send("data saving error!" + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("invalide credentioal");
    }
    const passwordValidate = await user.validatePassword(password);
    if (!passwordValidate) {
      throw new Error("invalide credentioal");
    } else {
      var token = await user.getJwt();
      res.cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        // maxAge: 7 * 24 * 60 * 60 * 1000,
        // httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.json({ message: "login success", data: user });
    }
    // await user.save();
    // res.send("user added successfully!");
  } catch (error) {
    res.status(400).send("error:" + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("logout successful!");
});

module.exports = authRouter;
