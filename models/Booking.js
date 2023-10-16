const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const moment = require("moment-timezone");

// Atur zona waktu ke GMT+7 (Waktu Indonesia Barat)
moment.tz.setDefault("Asia/Jakarta");

const bookingSchema = new mongoose.Schema({
  bookingStartDate: {
    type: Date,
    required: true,
  },
  bookingEndDate: {
    type: Date,
    required: true,
  },
  invoice: {
    type: String,
    required: true,
  },
  track: {
    type: String,
    required: true,
  },
  itemId: {
    _id: {
      type: ObjectId,
      ref: "Item",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    userId: {
      type: ObjectId,
      ref: "Users",
    },
  },
  total: {
    type: Number,
    required: true,
  },
  memberId: [
    {
      type: ObjectId,
      ref: "Member",
    },
  ],
  profileId: {
    _id: {
      type: ObjectId,
      ref: "Profile",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  },
  EquipmentId: {
    type: ObjectId,
    ref: "Equipment",
  },
  bankId: {
    type: ObjectId,
    ref: "Bank",
  },
  boarding: {
    boarding_status: {
      type: String,
      default: null,
    },
    boarding_start: {
      type: String,
      default: null,
    },
    boarding_end: {
      type: String,
      default: null,
    },
    startAt: {
      type: Date,
      default: null,
    },
    endAt: {
      type: Date,
      default: null,
    },
  },
  payments: {
    payment_status: {
      type: String,
      default: null,
    },
    midtrans_url: {
      type: String,
    },
    status: {
      type: String,
      default: "Proses",
    },
  },
  createdAt: {
    type: Date,
    default: function () {
      const originalTimestamp = moment.tz("Asia/Jakarta"); // Your original timestamp

      const originalDate = new Date(originalTimestamp);

      originalDate.setHours(originalDate.getHours() + 7);

      if (originalDate.getHours() >= 24) {
        originalDate.setHours(originalDate.getHours() - 24);
      }

      const modifiedTimestamp = originalDate.toISOString();
      return modifiedTimestamp;
    },
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
