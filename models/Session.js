const mongoose = require('mongoose');

const { Schema } = mongoose;

const sessionSchema = new Schema({
  movie: { type: String, required: true },
  cinema: { type: String , required: true },
  date: { type: String, required: true },
  movie_id: { type: Schema.Types.ObjectId, ref: 'Movie' },
  times: [{ type: String, required: true }],
  room: String,
  dubbed: Boolean,
  extra_features: String,
});

const Session = mongoose.model('movie_session', sessionSchema);

module.exports = Session;
