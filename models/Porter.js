const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const porterSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  noHandphone: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "free",
  },
  payments: {
    status: {
      type: String,
      default: null,
    },
    payment_url: {
      type: String,
      default: null,
    },
  },
  startBooking: {
    type: Date,
    default: null,
  },
  endBooking: {
    type: Date,
    default: null,
  },
  itemId: {
    type: ObjectId,
    ref: "Item",
  },
});

module.exports = mongoose.model("Porter", porterSchema);
