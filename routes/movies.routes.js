const express = require("express");
const router = express.Router();

const {
  getAllMovies,
  upcomingMovies,
  getOneMovie
} = require("../controllers/movies.controller");

router.get("/all-movies", getAllMovies);
router.get("/upcoming-movies", upcomingMovies);
router.get("/:id", getOneMovie);

module.exports = router;
