const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const token = req.headers["authorization"];

  const getToken = token && token.split(" ")[1];
  if (!token) {
    return res.status(404).json({
      success: false,
      message: "Token not found",
    });
  }
  //decode the token
  try {
    const decodedToken = jwt.verify(getToken, process.env.JWT_SECRET_KEY);
    req.userInfo = { userId: decodedToken.userId };
    next();
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = authMiddleware;
