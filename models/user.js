const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Email is invalid"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["user", "moderator", "admin"],
      default: "user",
      trim: true,
    },
    participatedRaffles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Raffle",
      },
    ],
    purchasedTickets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
  { timestamps: true }
);

userSchema.statics.encryptPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

userSchema.statics.comparePassword = async function (password, receivedPassword) {
  return await bcrypt.compare(password, receivedPassword);
};

userSchema.pre("findOneAndUpdate", async function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

module.exports = mongoose.model("User", userSchema);
