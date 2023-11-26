const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const reviewSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Review", reviewSchema);
