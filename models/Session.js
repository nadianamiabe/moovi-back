const mongoose = require('mongoose');

const { Schema } = mongoose;

const sessionSchema = new Schema(
  {
    date: { type: String, required: true },
    movie: { type: Schema.Types.ObjectId, ref: 'Movie' },
    times: [{ type: String, required: true }],
    room: { type: String },
    dubbed: { type: Boolean, required: true },
    extra_features: { type: String },
  },
  {
    timestamps: true,
  },
);

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
