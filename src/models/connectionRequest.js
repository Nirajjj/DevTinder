const mongoose = require("mongoose");
const User = require("../models/user");

const connectionRequest = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["interested", "ignored", "accepted", "rejected"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
connectionRequest.index({ fromUserId: 1, toUserId: 1 });
connectionRequest.pre("save", function (next) {
  const user = this;
  console.log(user.fromUserId === user.toUserId);

  if (user.fromUserId.equals(user.toUserId)) {
    throw new Error("can't send request to yourself!");
  }
  next();
});
const Connection = mongoose.model("Connection", connectionRequest);
module.exports = Connection;
