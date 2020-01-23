const axios = require('axios');
const { google } = require('googleapis');
const Movie = require('../models/Movie');
const Session = require('../models/Session');

const tmdbBaseUrl = 'https://api.themoviedb.org/3/';

const filterTmdbResults = (arr) => arr.map((movie) => ({
  title: movie.title,
  original_title: movie.original_title,
  original_language: movie.original_language,
  tmdb_id: movie.id,
  poster_urls: [
    `https://image.tmdb.org/t/p/w154${movie.poster_path}`,
    `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
  ],
  overview: movie.overview,
  release_date: movie.release_date,
}));

const getMovieTrailer = async (req, res) => {
  try {
    const { title, language } = req.query;
    const youtube = google.youtube({
      version: 'v3',
      auth: process.env.GOOGLE_API_KEY
    });
    const response = await youtube.search.list({
      part: 'snippet',
      q: `${title} trailer`,
      type: 'video',
      videoDuration: 'short',
      regionCode: 'BR',
      relevanceLanguage: language
    });
    res.status(200).json(response.data.items[0]);
  } catch (error) {
    res.status(400).json(error);
  }
};

const getAllPlayingMovies = async (url, page, movies) => {
  const config = {
    params: {
      api_key: process.env.TMDB_KEY,
      language: 'pt-BR',
      region: 'BR',
      page,
    },
  };
  try {
    const request = await axios.get(url, config);
    const allMovies = movies.concat(request.data.results);
    const { total_pages } = request.data;
    if (request.data.page < total_pages) {
      return getAllPlayingMovies(url, page + 1, allMovies);
    }
    return allMovies;
  } catch (error) {
    console.log(error);
    return error;
  }
};

// const getNowPlaying = async (req, res) => {
//   try {
//     let allMovies = await getAllPlayingMovies(`${tmdbBaseUrl}movie/now_playing`, 1, []);
//     allMovies = allMovies.filter((movie) => (movie.overview.length > 0 && movie.poster_path !== null));
//     const result = filterTmdbResults(allMovies);
//     res.status(200).json({ result });
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({ message: 'Unable to get movies', error: error.message });
//   }
// };

const getMovieByName = async (name) => {
  const date = new Date();
  const year = date.getFullYear();
  const config = {
    params: {
      api_key: process.env.TMDB_KEY,
      language: 'pt-BR',
      region: 'BR',
      query: name,
    },
  };
  try {
    const request = await axios.get(`${tmdbBaseUrl}search/movie`, config);
    const movies = request.data.results;
    if (movies.length > 1) {
      return movies.filter((movie) => movie.release_date && movie.release_date.slice(0, 4) >= year - 1);
    }
    return movies;
  } catch (error) {
    return error;
  }
};

const getDetail = async (req, res) => {
  console.log(req.params);
  const { id } = req.params;
  const movie = await Movie.findById(id);
  console.log(movie);
  try {
    const tmdbDetail = await axios.get(`${tmdbBaseUrl}movie/${movie.tmdb_id}`, {
      params: { api_key: process.env.TMDB_KEY, language: 'pt-BR', region: 'BR' }
    });
    const { imdb_id } = tmdbDetail.data;
    const request = await axios.get(
      `http://omdbapi.com/?apikey=${process.env.OMDB_KEY}&i=${imdb_id}`
    );
    if (request.data.Response === 'True') {
      res.status(200).json({ movie, omdbDetail: request.data });
    } else {
      res.status(200).json({ movie });
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Unable to get movie detail', error: error.message });
  }
};

const deleteAndSaveMovies = async (movies) => {
  try {
    await Movie.deleteMany({});
    const newMovies = await Movie.create(movies);
    return newMovies;
  } catch (error) {
    return error;
  }
};

const getMoviesFromNameList = async (list) => {
  try {
    const allMovies = await getAllPlayingMovies(`${tmdbBaseUrl}movie/now_playing`, 1, []);
    const allNames = allMovies.map((el) => el.title);
    const promises = list.map(async (name) => {
      const index = allNames.indexOf(name);
      if (index === -1) {
        const movies = await getMovieByName(name);
        console.log(movies);
        if (movies.length < 2) {
          return movies[0];
        }
        const filtered = movies.filter((movie) => movie.title === name);
        if (filtered.length > 0) {
          return filtered[0];
        }
        return movies[0];
      }
      return allMovies[index];
    });
    const response = await Promise.all(promises);
    return filterTmdbResults(response.filter((el) => el));
  } catch (error) {
    return error;
  }
};

const getMovies = async (req, res) => {
  try {
    const moviesSaved = await Movie.find().limit(1);
    if (moviesSaved.length > 0) {
      const all = await Movie.find();
      res.status(200).json(all);
    } else {
      const list = await Session.distinct('movie_name');
      const movies = await getMoviesFromNameList(list);
      console.log(movies);
      const saved = await deleteAndSaveMovies(movies);
      if (saved) {
        res.status(200).json(saved);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getMovies,
  getDetail,
  getMovieTrailer,
};
