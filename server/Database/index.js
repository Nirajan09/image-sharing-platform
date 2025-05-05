const mongoose = require("mongoose");

const connectToDB = async () => {
  await mongoose
    .connect(process.env.CONNECTION_STRING)
    .then(() => {
      console.log("Database Connection is Successful");
    })
    .catch((e) => {
      console.log("Database Connection Failed", e);
    });
};
module.exports = connectToDB;
