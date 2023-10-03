const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

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
  EquipmentId: {
    type: ObjectId,
    ref: "Equipment",
  },
  bankId: {
    type: ObjectId,
    ref: "Bank",
  },
  boarding: {
    type: String,
    default: "Registrasi",
  },
  payments: {
    payment_status: {
      type: String,
      default: null,
    },
    midtrans_url: {
      type: String,
    },
    midtrans_booking_code: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      default: "Proses",
    },
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
