const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://nirajparab:0ZBWDwmIO5fnWNZE@skyvault.szx3n.mongodb.net/devTinder"
    // "mongodb+srv://nirajparab::0ZBWDwmIO5fnWNZE@skyvault.szx3n.mongodb.net/?retryWrites=true&w=majority&appName=SkyVault"
  );
};

module.exports = connectDb;
