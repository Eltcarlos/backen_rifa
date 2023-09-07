const mongoose = require("mongoose");

const raffleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    soldTickets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
      },
    ],
    participatingUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["open", "closed", "suspend"],
      default: "open",
      trim: true,
    },
    posterImage: {
      type: String,
    },
    backgroundImage: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Raffle", raffleSchema);
