const express = require("express");
const connectDb = require("./config/database");
const cookieParser = require("cookie-parser");
// const { validatePassword } = require("./models/user");

const app = express();
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/authentication");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDb()
  .then(() => {
    console.log("connection establish...");
    app.listen(7777, () => {
      console.log("sever is listening");
    });
  })
  .catch(() => {
    console.log("connection faild");
  });
