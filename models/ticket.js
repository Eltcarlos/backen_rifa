const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const ticketSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
      unique: true,
    },
    raffle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Raffle",
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
ticketSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Ticket", ticketSchema);
