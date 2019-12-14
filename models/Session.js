const mongoose = require('mongoose');

const { Schema } = mongoose;

const sessionSchema = new Schema({
  cinema: { type: String , require: true },
  date: { type: String, required: true },
  movie: { type: String, required: true },
  times: [{ type: String, required: true }],
  room: String,
  dubbed: Boolean,
  extra_features: String,
});

const Session = mongoose.model('movie_session', sessionSchema);

module.exports = Session;
