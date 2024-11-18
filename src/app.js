const express = require("express");

const app = express();
const auth = require("./middleware/auth");

app.use("/admin", auth);
app.get("/admin/alluserdata", (req, res, next) => {
  res.send("all data send");
});
app.get("/user/login", (req, res, next) => {
  res.send("login page");
});
app.get("/user/getuser",auth,  (req, res, next) => {
  // throw new Error("getuser error");
  res.send("user data send");
});
app.use("/", (err, req, res, next) => {
  console.log(err.message);
  
  if(err){
    res.status(500).send("something went wrong")
  }
  res.send("this is dashboard")
});

app.listen(7777, () => {
  console.log("sever is listening");
});
