const User = require("../models/User");

const jwt = require("jsonwebtoken");

const authMidleware = async (req, res, next) => {
  let token = null;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const [Bearer, token] = req.headers.authorization.split(" ");
      const { ID } = jwt.verify(token, "pizza");
      const user = await User.findById(ID).select("-userPassword");
      req.user = user;
      if (!req.user) {
        return res.status(400).json({
          code: 400,
          message: `Unable to find user ${ID}`,
        });
      }
      next();
    } catch (error) {
      res.status(401).json({
        code: 401,
        message: "User not autorization",
        error,
      });
    }
  }
};

module.exports = authMidleware;
