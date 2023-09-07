const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    raffle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Raffle",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
transactionSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Transaction", transactionSchema);
