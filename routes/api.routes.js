const express = require("express");
const jwt = require("jsonwebtoken");

const userRoutes = require("./user.routes");
const movies = require("./movies.routes");

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
    console.log(error);

    res.status(401).json({ message: "Token expirado", status: 401 });
  }
};

router.use("/users", userRoutes);

router.use(verifyLoggedAreaToken());

router.use("/movies", movies);

module.exports = router;
