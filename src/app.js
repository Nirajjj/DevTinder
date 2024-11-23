const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");

const app = express();
app.use(express.json());
app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("user added successfully!");
  } catch (error) {
    res.status(400).send("data saving error!" + error.message);
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

  // firstName
  // "harry"
  // lastName
  // "poter"
  // email
  // "harry@gmailcom"
  // password
  // "harry@123"
  // createdAt
  // 2024-11-23T03:07:44.034+00:00
  // updatedAt
  // 2024-11-23T03:07:44.034+00:00
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
