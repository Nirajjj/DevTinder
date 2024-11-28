const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());

// _id
// 6741470014c9093accd84f17
// firstName
// "harryy"
// lastName
// "poter"
// email
// "harry@gmailcom"
// password
// "harry@123"
// createdAt
// 2024-11-23T03:07:44.034+00:00
// updatedAt
// 2024-11-23T04:33:54.980+00:00
// __v
// 0
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
    const passwordValidate = await bcrypt.compare(password, user.password);
    if (!passwordValidate) {
      throw new Error("invalide credentioal");
    } else {
      res.send("login success");
    }
    // await user.save();
    // res.send("user added successfully!");
  } catch (error) {
    res.status(400).send("error:" + error.message);
  }
});

app.get("/feed", async (req, res) => {
  const userEmail = req.body.email;

  try {
    const userData = await User.find();
    // user.save();
    res.send(userData);
  } catch (error) {
    res.status(400).send("data saving error!" + error);
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.id;

  try {
    const userData = await User.findOneAndDelete(userId);
    // user.save();
    res.send("user deleted successfully");
  } catch (error) {
    res.status(400).send("data saving error!" + error);
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const object = req.body;
  try {
    const approveUpdateKeys = [
      "firstName",
      "lastLame",
      "password",
      "age",
      "gender",
    ];
    const updateKeys = Object.keys(object).every((key) =>
      approveUpdateKeys.includes(key)
    );
    if (!updateKeys) {
      throw new Error("can't update");
    }
    const userData = await User.findByIdAndUpdate(userId, object, {
      runValidators: true,
    });
    // user.save();
    res.send("user updated successfully");
  } catch (error) {
    res.status(400).send("data saving error!" + error);
  }
});
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
