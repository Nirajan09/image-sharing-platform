require("dotenv").config();
const express = require("express");
const router = require("./Routes/authRoute");
const mediaRoute = require("./Routes/mediaRoute.js");
const connectToDB = require("./Database/index.js");
const cors = require("cors");

const app = express();

connectToDB();

app.use(cors({
  origin: "*",
  credentials: true
}));


app.use(express.json());

app.use("/api", router);
app.use("/api/media", mediaRoute);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on the port ${PORT}`);
});
