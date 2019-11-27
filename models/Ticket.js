const mongoose = require('mongoose');

const { Schema } = mongoose;

const ticketSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    movie: { type: Schema.Types.ObjectId, ref: 'Movie' },
    movie_theater: { type: Schema.Types.ObjectId, ref: 'MovieTheater' },
    show_time: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
