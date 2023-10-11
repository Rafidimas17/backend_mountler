const mongoose = require("mongoose");

const EquipmetSchema = new mongoose.Schema({
  jumlahTenda: {
    type: Number,
    required: true,
  },
  jumlahKompor: {
    type: Number,
    required: true,
  },
  jumlahMatras: {
    type: Number,
    required: true,
  },
  jumlahP3k: {
    type: Number,
    required: true,
  },
  jumlahSleepingBag: {
    type: Number,
    required: true,
  },
  jumlahCarrier: {
    type: Number,
    required: true,
  },
  jumlahHeadlamp: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Equipment", EquipmetSchema);
