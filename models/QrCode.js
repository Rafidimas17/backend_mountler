const mongoose = require("mongoose");

const qrShcema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("QrCode", qrShcema);
