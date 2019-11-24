const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: String,
    password: String,
    email: String,
    isSubscribed: { type: Boolean, default: false },
    registrationData: {
      cpf: Number,
      city: String,
      state: String,
      country: String,
      creditCard: {
        number: Number,
        name: String,
        ccv: Number
      },
      planType: { type: String, enum: ["plan1", "plan2", "plan3"] }
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
