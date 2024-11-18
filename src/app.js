const express = require("express");

const app = express();

// app.use("/hello", (req, res) => {
//   res.send("this is hello page");
// });
app.get("/ab?cd", (req, res) => {
  // res.send("this is hello page");
  res.send("zxcv called from get method");
  
});
app.get("/zx*cv", (req, res) => {
  // res.send("this is hello page");
  res.send("zxcv called from get method");
  
});


app.post("/hello", (req, res) => {
  res.send("hello called from post method");

});
app.delete("/hello", (req, res) => {
  res.send("hello called from delete method");

});
app.patch("/hello", (req, res) => {
  res.send("hello called from patch method");

});

app.put("/hello", (req, res) => {
  res.send("hello called from put method");

});
app.use("/hello/123", (req, res) => {
  res.send("this is hello page");
});
app.use("/namskar", (req, res) => {
  res.send("this is namskar page");
});

app.use("/", (req, res) => {
  res.send("this is dashboard");
});

app.listen(7777, () => {
  console.log("sever is listening");
});
