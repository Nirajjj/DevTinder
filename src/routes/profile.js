const express = require("express");
const profileRoutes = express.Router();
const userAuth = require("../middleware/auth");
const { validateEditData, validatePassword } = require("../utils/validation");
const bcrypt = require("bcrypt");

profileRoutes.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (e) {
    res.status(403).send("error: " + e.message);
  }
});

profileRoutes.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditData(req.body)) {
      throw new Error("this data can't be change");
    }
    const userOriginalData = req.user;
    Object.keys(req.body).forEach((key) => {
      userOriginalData[key] = req.body[key];
    });
    await userOriginalData.save();
    // const user = req.user;
    res.send({
      message: `${userOriginalData.firstName}, your data is update`,
      updatedData: userOriginalData,
    });
  } catch (e) {
    res.status(403).send("error: " + e.message);
  }
});
profileRoutes.patch("/profile/forgotpassword", userAuth, async (req, res) => {
  try {
    if (!validatePassword(req.body)) {
      throw new Error("this data can't be change");
    }
    const user = req.user;
    const isPasswordValid = await user.validatePassword(req.body.oldPassword);
    if (!isPasswordValid) {
      throw new Error("invalid credentioals");
    }
    const userOriginalData = req.user;
    const passwordHash = await bcrypt.hash(req.body.newPassword, 10);
    // Object.keys(req.body).forEach((key) => {
      userOriginalData["password"] = passwordHash;
    // });
    await userOriginalData.save();
    // const user = req.user;
    res.send({
      message: `${userOriginalData.firstName}, your data is update`,
      updatedData: userOriginalData,
    });
  } catch (e) {
    res.status(403).send("error: " + e.message);
  }
});
module.exports = profileRoutes;
