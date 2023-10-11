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
      "./models/Activity",
      "./models/Member",
      "./models/Image",
      "./models/Member",
      "./models/Booking",
      "./models/Users",

      "./models/Track", // Add the Track model file path here
    ]);

    // Clear specified collections
    seeder.clearModels(["Booking"], function () {
      // Callback to populate DB once collections have been cleared
      seeder.populateModels(data, function () {
        seeder.disconnect();
      });
    });
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
