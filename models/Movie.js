const mongoose = require('mongoose');

const { Schema } = mongoose;

const movieSchema = new Schema(
  {
    title: { type: String, required: true },
    original_title: String,
    tmdb_id: String,
    imdb_id: String,
    original_languange: String,
    release_date: String,
    genre: String,
    overview: String,
    poster_urls: [String],
    ratings: [],
    rated: String,
  },
  {
    timestamps: true,
  },
);

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
