const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", ""); // Get token from header

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
