const jwd = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).send("Unauthorized access");
  }
  const decodObj = await jwd.verify(token, "devTinderByNirajParab");
  const { id } = decodObj;
  const user = await User.findById(id);
  if (!user) {
    return res.status(401).send("Unauthorized access");
  }
  req.user = user;
  next();
};

module.exports = userAuth;
