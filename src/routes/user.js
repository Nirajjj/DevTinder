const express = require("express");
const userAuth = require("../middleware/auth");
const Connection = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

const SAFE_DATA_SEND = "firstName lastName about skill age";
// this api get will get the all user specific data who is send the request to loginuser
userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loginUserId = req.user._id;

    const requests = await Connection.find({
      toUserId: loginUserId,
      status: "interested",
    }).populate("fromUserId", SAFE_DATA_SEND);
    res.json({ message: "request received", data: requests });
    if (!requests) {
      throw new Erro("no request");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loginUserId = req.user._id;
    const connectionObjects = await Connection.find({
      $or: [
        { fromUserId: loginUserId, status: "accepted" },
        { toUserId: loginUserId, status: "accepted" },
      ],
    })
      .populate("fromUserId", SAFE_DATA_SEND)
      .populate("toUserId", SAFE_DATA_SEND);
    const Connections = connectionObjects.map((row) => {
      if (row.fromUserId._id.toString() === loginUserId.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data: Connections });
  } catch (error) {
    res.send("ERROR: " + error.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loginUserId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    let skip = (page - 1) * limit;

    const connectionRequests = await Connection.find({
      $or: [{ fromUserId: loginUserId }, { toUserId: loginUserId }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });
    const ObjectToArray = Array.from(hideUsersFromFeed);
    const feedCards = await User.find({
      $and: [{ _id: { $nin: ObjectToArray } }, { _id: { $ne: loginUserId } }],
    })
      .skip(skip)
      .limit(limit);
    res.json({ feedCards });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});
module.exports = userRouter;
