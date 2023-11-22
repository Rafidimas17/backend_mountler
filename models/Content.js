const mongoose = require("mongoose");

const contentSchema = mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Content", contentSchema);
