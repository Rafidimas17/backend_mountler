var seeder = require("mongoose-seed");
var mongoose = require("mongoose");
require("dotenv").config();

// Connect to MongoDB via Mongoose
seeder.connect(
  "mongodb+srv://bendosiap45:d8dP8UKiBJn6NBLC@cluster0.yzlgzli.mongodb.net/?retryWrites=true&w=majority",
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
      "./models/Review",
      "./models/Booking",
      "./models/Profile",
      "./models/Users",
      "./models/Porter",
      "./models/Track", // Add the Track model file path here
    ]);

    // Clear specified collections
    clearCollections();
  }
);

async function clearCollections() {
  try {
    // Clear specified collections, excluding Users
    await mongoose.model("Category").deleteMany({});
    await mongoose.model("Bank").deleteMany({});
    await mongoose.model("Item").deleteMany({});
    await mongoose.model("Equipment").deleteMany({});
    await mongoose.model("Feature").deleteMany({});
    await mongoose.model("QrCode").deleteMany({});
    await mongoose.model("Activity").deleteMany({});
    await mongoose.model("Member").deleteMany({});
    await mongoose.model("Image").deleteMany({});
    await mongoose.model("Review").deleteMany({});
    await mongoose.model("Booking").deleteMany({});
    await mongoose.model("Profile").deleteMany({});
    await mongoose.model("Porter").deleteMany({});
    await mongoose.model("Track").deleteMany({});

    console.log("Collections cleared successfully");
  } catch (error) {
    console.error("Error clearing collections:", error);
  } finally {
    // Disconnect from the database
    mongoose.disconnect();
  }
}

var data = [
  // Users collection (admin user only)
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

// Seed the Users collection
seeder.populateModels(data, function () {
  // Disconnect from the database after seeding
  mongoose.disconnect();
});
