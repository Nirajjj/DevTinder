const express = require("express");
const requestRoute = express.Router();
const userAuth = require("../middleware/auth");
const Connection = require("../models/connectionRequest");
const { default: mongoose } = require("mongoose");

// requestRoute.post("/connectionRequest", userAuth, (req, res) => {
//   const user = req.user;
//   if (!user) {
//     return res.status(403).send("unauthorized access");
//   }
//   try {
//     res.send(user.firstName + "send connection request");
//   } catch (error) {
//     res.status(403).send("error: " + error.message);
//   }
// });
requestRoute.post("/request/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["interested", "ignored"];
    const isStatusAllowed = allowedStatus.includes(status);
    if (!isStatusAllowed) {
      throw new Error("invalid user");
    }
    const notAllowedUser = await Connection.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    
    if(notAllowedUser){
      throw new Error("Connection already made!")
    }
    const connection = new Connection({ fromUserId, toUserId, status });
    await connection.save();
    res.send("connection made!");
  } catch (error) {
    res.status(400).send("connection error " + error.message);
  }
});

requestRoute.post("/request/review/:status/:requestId", userAuth, async (req, res)=> {
  try {
    const loginUserId = req.user._id
    const {status, requestId} = req.params
    const allowedStatus = ["accepted", "rejected"]
    const isStatusAllowed = allowedStatus.includes(status)
    if(!isStatusAllowed){
      throw new Error("status is not allowed")
    } 
    const isRequestId = mongoose.isValidObjectId(requestId)
    if(!isRequestId){
      throw new Error("user not found")
    }
    const request = Connection.findOne({
      _id: requestId,
      toUserId: loginUserId,
      status: "interested"
    })   
    if(!request){
      throw new Error("user not found")
    }
    await Connection.findByIdAndUpdate(requestId, {status})
    res.json({message: `request ${status}`})
  } catch (error) {
    res.status(400).send("ERROR " + error.message)
  }
})

module.exports = requestRoute;
