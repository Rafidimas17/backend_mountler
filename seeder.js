var seeder = require("mongoose-seed");
var mongoose = require("mongoose");
require("dotenv").config();

// Connect to MongoDB via Mongoose
seeder.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  },
  function () {
    // Load Mongoose models
    seeder.loadModels([
      "./models/Category",
      "./models/Bank",
      "./models/Item",
      "./models/Equipment",
      "./models/Feature",
      "./models/QrCode",
      "./models/Activity",
      "./models/Member",
      "./models/Image",
      "./models/Member",
      "./models/Booking",
      "./models/Users",
      "./models/Porter",
      "./models/Track", // Add the Track model file path here
    ]);

    // Clear specified collections
  }
);

var data = [
  // start category
  {
    model: "Category",
    documents: [],
  },
  // end category
  // start item

  // end item
  // start image
  {
    model: "Image",
    documents: [],
  },
  // end image
  // start feature
  {
    model: "Feature",
    documents: [],
  },
  // end feature
  // start activity
  {
    model: "Activity",
    documents: [],
  },
  // end activity

  // start booking
  {
    model: "Booking",
    documents: [],
  },
  // end booking

  // member
  {
    model: "Member",
    documents: [],
  },
  {
    model: "Bank",
    documents: [],
  },
  {
    model: "Equipment",
    documents: [],
  },
  {
    model: "Track",
    documents: [],
  },
  {
    models: "Porter",
    documents: [
      {
        _id: mongoose.Types.ObjectId("5dd8f07a5a8e7647a41005b1"),
        payments: {
          status: "waiting",
          payment_url: null,
        },
        status: "free",
        startBooking: null,
        endBooking: null,
        name: "John Doe",
        age: 36,
        imageUrl: "images/1700325304638.jpg",
        itemId: mongoose.Types.ObjectId("651e1dfebf0fc942e41ba0bd"),
        noHandphone: 62756354615176,
        price: 10000,
        bookingId: [],
      },
      {
        _id: mongoose.Types.ObjectId("5dd8f07a5a8e7647a41005b2"),
        payments: {
          status: "waiting",
          payment_url: null,
        },
        status: "free",
        startBooking: null,
        endBooking: null,
        name: "Darmawan",
        age: 36,
        imageUrl: "images/1700325304638.jpg",
        itemId: mongoose.Types.ObjectId("651e1dfebf0fc942e41ba0bd"),
        noHandphone: 62756354615176,
        price: 10000,
        bookingId: [],
      },
      {
        _id: mongoose.Types.ObjectId("5dd8f07a5a8e7647a41005b3"),
        payments: {
          status: "waiting",
          payment_url: null,
        },
        status: "free",
        startBooking: null,
        endBooking: null,
        name: "Wahyu",
        age: 36,
        imageUrl: "images/1700325304638.jpg",
        itemId: mongoose.Types.ObjectId("651e1dfebf0fc942e41ba0bd"),
        noHandphone: 62756354615176,
        price: 10000,
        bookingId: [],
      },
    ],
  },
  {
    model: "Users",
    documents: [
      {
        _id: mongoose.Types.ObjectId("5e96cbe292b97300fc903345"),
        username: "admin",
        password: "admin",
        role: "admin",
        organizer: "Admin",
        noPhone: 6285645663350,
        address: "Jl. Jawa No.2 Ranupane, Lumajang",
      },
    ],
  },
];
