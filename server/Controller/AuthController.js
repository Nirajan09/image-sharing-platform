const User = require("../Model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    //check if username or email already exists in the database

    const user = await User.findOne({ $or: [{ username }, { email }] });

    if (user) {
      return res.status(401).json({
        success: false,
        message: "Username or Email already exists in the database",
      });
    }

    //Hashed the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const insertData = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });
    if (insertData) {
      res.status(200).json({
        success: true,
        message: "User Registered Successfully",
        data: insertData,
      });
    }
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    // check if username is valid or not
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Username is Invalid",
      });
    }
    //check if password is valid or not

    const userPassword = await bcrypt.compare(password, user.password);
    if (!userPassword) {
      return res.status(401).json({
        success: false,
        message: "Password is Invalid",
      });
    }
    //generate the token
    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login Success",
      accessToken,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = { register, login };
