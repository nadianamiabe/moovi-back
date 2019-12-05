const axios = require('axios');

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

const getNowPlaying = async (req, res) => {
  const config = {
    params: {
      api_key: process.env.TMDB_KEY,
      language: 'pt-BR',
      region: 'US',
    },
  };
  try {
    const request = await axios.get(`${tmdbBaseUrl}movie/now_playing`, config);
    const movies = filterTmdbResults(request.data.results);
    res.status(200).json({ movies });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'Unable to get movies', error: error.message });
  }
};

const getMovieByName = async (req, res) => {
  const { title } = req.query;
  console.log(title);
  const date = new Date();
  const year = date.getFullYear();
  const config = {
    params: {
      api_key: process.env.TMDB_KEY,
      language: 'pt-BR',
      region: 'BR',
      query: title,
    },
  };
  try {
    const request = await axios.get(`${tmdbBaseUrl}search/movie`, config);

    let movies = filterTmdbResults(request.data.results);
    movies = movies.filter((movie) => movie.release_date.slice(0, 4) >= year - 1);

    res.status(200).json(movies.sort((a, b) => b.release_date - a.release_date)[0]);
  } catch (error) {
    res.status(400).json({ message: 'Unable to get movies', error: error.message });
  }
};

const getDetail = async (req, res) => {
  console.log(req.params);
  const { id } = req.params;
  try {
    const tmdbDetail = await axios.get(`${tmdbBaseUrl}movie/${id}`, { params: { api_key: process.env.TMDB_KEY } });
    const { imdb_id } = tmdbDetail.data;
    const request = await axios.get(`http://omdbapi.com/?apikey=${process.env.OMDB_KEY}&i=${imdb_id}`);
    if (request.data.Response === 'True') {
      res.status(200).json(request.data);
    } else {
      res.status(400).json({ message: 'Unable to get movie detail', error: request.data.Error });
    }
  } catch (error) {
    res.status(400).json({ message: 'Unable to get movie detail', error: error.message });
  }
};


module.exports = {
  getNowPlaying,
  getMovieByName,
  getDetail,
};
