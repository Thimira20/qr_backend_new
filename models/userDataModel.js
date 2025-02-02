// models/userDataModel.js
const mongoose = require("mongoose");

const userDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  qrText: { type: String, required: true },
  qrImageUrl: { type: String, required: true },
  isFavorite: { type: Boolean, default: false }, 
});

module.exports = mongoose.model("UserData", userDataSchema);
