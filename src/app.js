const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const userAuth = require("./middleware/auth");
// const { validatePassword } = require("./models/user");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ firstName, lastName, email, password: passwordHash });
  try {
    await user.save();
    res.send("user added successfully!");
  } catch (error) {
    res.status(400).send("data saving error!" + error.message);
  }
});

app.post("/login", async (req, res) => {
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
      });
      res.send("login success");
    }
    // await user.save();
    // res.send("user added successfully!");
  } catch (error) {
    res.status(400).send("error:" + error.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  // const token = req.cookies.token;
  // console.log(token);

  // if (!token) {
  //   return res.status(401).send("unauthorized access");
  // }
  //   // const user = await User.findById(token);
  //   // if (!user) {
  //   //   return res.status(403).send("unauthorized access");
  //   // }
  //   const userId = jwt.verify(token, "devTinderByNirajParab");
  //   console.log(userId);
  //   const user = await User.findById(userId.id);
  //   if (!user) {
  //     return res.status(403).send("unauthorized access");
  //   }
  try {
    const user = req.user;
    res.send(user);
  } catch (e) {
    res.status(403).send("error: " + e.message);
  }
});
app.post("/connectionRequest", userAuth, (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(403).send("unauthorized access");
  }
  try {
    res.send(user.firstName + "send connection request");
  } catch (error) {
    res.status(403).send("error: " + error.message);
  }
});
// app.get("/feed", async (req, res) => {
//   const userEmail = req.body.email;

//   try {
//     const userData = await User.find();
//     // user.save();
//     res.send(userData);
//   } catch (error) {
//     res.status(400).send("data saving error!" + error);
//   }
// });

// app.delete("/user", async (req, res) => {
//   const userId = req.body.id;

//   try {
//     const userData = await User.findOneAndDelete(userId);
//     // user.save();
//     res.send("user deleted successfully");
//   } catch (error) {
//     res.status(400).send("data saving error!" + error);
//   }
// });

// app.patch("/user/:userId", async (req, res) => {
//   const userId = req.params.userId;
//   const object = req.body;
//   try {
//     const approveUpdateKeys = [
//       "firstName",
//       "lastLame",
//       "password",
//       "age",
//       "gender",
//     ];
//     const updateKeys = Object.keys(object).every((key) =>
//       approveUpdateKeys.includes(key)
//     );
//     if (!updateKeys) {
//       throw new Error("can't update");
//     }
//     const userData = await User.findByIdAndUpdate(userId, object, {
//       runValidators: true,
//     });
//     // user.save();
//     res.send("user updated successfully");
//   } catch (error) {
//     res.status(400).send("data saving error!" + error);
//   }
// });
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
