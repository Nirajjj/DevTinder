const express = require("express");

const app = express();

app.use("/", (req, res) => {
  res.send("this is dashboard");
});

app.use("/hello", (req, res) => {
  res.send("this is hello page");
});

app.use("/namskar", (req, res) => {
  res.send("this is namskar page");
});

app.listen(7777, () => {
  console.log("sever is listening");
});
