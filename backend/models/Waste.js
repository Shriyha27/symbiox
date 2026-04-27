const mongoose = require("mongoose");

const wasteSchema = new mongoose.Schema({
  wasteType: String,
  quantity: Number,
  location: {
    lat: Number,
    lng: Number
  }
});

module.exports = mongoose.model("Waste", wasteSchema);