const express = require("express");
const jwt = require("jsonwebtoken");
const userRoutes = require("./userRoutes");
const index = require("./index");

const router = express.Router();

const verifyLoggedAreaToken = () => (req, res, next) => {
  const authHeader = req.header("Authorization");

  const token = authHeader.split(" ")[1];

  try {
    const tokenInfo = jwt.verify(token, process.env.token);
    req.user = {
      username: tokenInfo.username,
      id: tokenInfo.id
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Token expirado", status: 401 });
  }
};

router.use("/users", userRoutes);

router.use(verifyLoggedAreaToken());

router.use("/", index);

module.exports = router;
