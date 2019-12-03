require("dotenv").config();

const Movie = require("../models/Movie");
const axios = require("axios");

const getAllMovies = async (req, res) => {
  let data = "";
  const movies = [];
  try {
    await axios
      .get(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.TMDB_API_KEY}&language=pt-BR&page=1&region=BR`
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
            release_date: movie.release_date,
            tmdb_id: movie.id
          });
        });
      });

    Movie.insertMany(movies);
    res.status(200).json(movies);
  } catch (error) {
    console.log(error);
  }
};

const upcomingMovies = async (req, res) => {
  let data = "";
  const upcomingMovies = [];
  try {
    await axios
      .get(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.TMDB_API_KEY}&language=pt-BR&page=1&region=BR`
      )
      .then(response => {
        data = response.data.results;
        data.forEach(movie => {
          upcomingMovies.push({
            original_title: movie.original_title,
            original_language: movie.original_language,
            title: movie.title,
            release_date: movie.release_date,
            overview: movie.overview,
            poster_urls: movie.poster_path
          });
        });
      });
    res.status(200).json({ upcomingMovies });
  } catch (error) {
    console.log(error);
  }
};

const getOneMovie = async (req, res) => {
  let data = [];
  const movieDetails = [];
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id);
    await axios(
      `https://api.themoviedb.org/3/movie/${movie.tmdb_id}?api_key=${process.env.TMDB_API_KEY}&language=pt-BR`
    ).then(response => {
      data.push(response.data);
      data.forEach(movie => {
        movieDetails.push({
          original_title: movie.original_title,
          original_language: movie.original_language,
          title: movie.title,
          release_date: movie.release_date,
          overview: movie.overview,
          poster_urls: movie.poster_path,
          tmdb_id: movie.id,
          imdb_id: movie.imdb_id
        });
      });
    });
    res.status(200).json(movieDetails);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllMovies,
  upcomingMovies,
  getOneMovie
};
