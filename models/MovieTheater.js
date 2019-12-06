const mongoose = require('mongoose');

const { Schema } = mongoose;

const movieTheaterSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  location: { lat: Number, lng: Number },
  sessions: [{ type: Schema.Types.ObjectId, ref: 'Session' }],
  place_id: { type: String, required: true },
  phone_number: { type: String },
  website: { type: String },
});

const MovieTheater = mongoose.model('MovieTheater', movieTheaterSchema);

module.exports = MovieTheater;
