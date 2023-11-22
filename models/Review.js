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
  imageId: {
    type: ObjectId,
    ref: "Image",
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
