const Movie = require("../models/Movie");
const axios = require("axios");

const getAllMovies = async (req, res) => {
  let data = "";
  const movies = [];
  try {
    await axios
      .get(
        "https://api.themoviedb.org/3/movie/now_playing?api_key=9870a1126969deb4ef642d4b0c802de4&language=pt-BR&page=1&region=BR"
      )
      .then(response => {
        data = response.data.results;
        data.forEach(movie => {
          movies.push({
            title: movie.title,
            original_title: movie.original_title,
            poster_urls: [
              `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            ],
            original_language: movie.original_language,
            overview: movie.overview,
            release_date: movie.release_date
          });
        });
      });

    Movie.insertMany(movies);
    res.status(200).json({ data });
  } catch (error) {
    console.log(error);
  }
};

const upcomingMovies = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllMovies
};
