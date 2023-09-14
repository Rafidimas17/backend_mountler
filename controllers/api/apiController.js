const Item = require("../../models/Item");
const Treveler = require("../../models/Member");
const Category = require("../../models/Category");
const Booking = require("../../models/Booking");
const Users = require("../../models/Users");
const Member = require("../../models/Member");
const axios = require("axios");
const Track = require("../../models/Track");

async function getCurrentDateTime() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const seconds = String(currentDate.getSeconds()).padStart(2, "0");

  const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  return formattedDateTime;
}
async function generateInvoice() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const length = 10; // Panjang invoice yang diinginkan

  let invoice = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    invoice += characters.charAt(randomIndex);
  }

  return invoice;
}
async function convertCelcius(value) {
  const celcius = ((value - 32) * 5) / 9;
  return celcius;
}

module.exports = {
  viewLandingPage: async (req, res) => {
    try {
      const mostPicked = await Item.find()
        .select("_id title country city price unit imageId")
        .limit(5)
        .populate({ path: "imageId", select: "_id imageUrl" })
        .populate({ path: "trackId", select: "_id name city province" });

      const category = await Category.find()
        .select("_id name")
        .limit(3)
        .populate({
          path: "itemId",
          select: "_id title country city isPopular imageId trackId",
          perDocumentLimit: 5,
          options: { sort: { sumBooking: -1 } },
          populate: [
            {
              path: "trackId",
              select: "_id name city province",
              perDocumentLimit: 1,
            },
            {
              path: "imageId",
              select: "_id imageUrl",
              perDocumentLimit: 1,
            },
          ],
        });

      const treveler = await Treveler.find();
      const treasure = await Item.find();
      const city = await Item.find();

      for (let i = 0; i < category.length; i++) {
        for (let x = 0; x < category[i].itemId.length; x++) {
          const item = await Item.findOne({ _id: category[i].itemId[x]._id });
          item.isPopular = false;
          await item.save();
          if (category[i].itemId[0] === category[i].itemId[x]) {
            item.isPopular = true;
            await item.save();
          }
        }
      }

      const testimonial = {
        _id: "asd1293uasdads1",
        imageUrl: "images/testimonial2.jpg",
        name: "Happy Family",
        rate: 4.55,
        content:
          "What a great trip with my family and I should try again next time soon ...",
        familyName: "Angga",
        familyOccupation: "Product Designer",
      };

      res.status(200).json({
        message: "Success",
        hero: {
          travelers: treveler.length,
          treasures: treasure.length,
          cities: city.length,
        },
        mostPicked,
        category,
        testimonial,
      });
    } catch (error) {
      // console.log(error);
      res.status(404).json({ message: "Empty Item" });
    }
  },

  detailPage: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id })
        .populate({ path: "featureId", select: "_id name qty imageUrl" })
        .populate({ path: "activityId", select: "_id name type imageUrl" })
        .populate({
          path: "imageId",
          select: "_id imageUrl",
          perDocumentLimit: 3,
        })
        .populate({ path: "trackId", select: "_id name city province" })
        .populate({
          path: "bankId",
          select: "_id name nomorRekening nameBank",
        });

      // const bank = await Bank.find();
      const address = item.trackId[0].city;
      const testimonial = {
        _id: "asd1293uasdads1",
        imageUrl: "images/testimonial1.jpg",
        name: "Happy Family",
        rate: 4.55,
        content:
          "What a great trip with my family and I should try again next time soon ...",
        familyName: "Angga",
        familyOccupation: "Product Designer",
      };
      // Add function to get current weather

      const currentDateTime = getCurrentDateTime();
      const apiKey = "3Q8NW6TFHK4YJHLTLWRUCSQR6";
      const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${address}/${await currentDateTime}?key=${apiKey}`;
      axios
        .get(url)
        .then((response) => {
          const weatherData = response.data;

          if (weatherData && weatherData.currentConditions) {
            const weatherTempF = weatherData.currentConditions.temp;
            const condition = weatherData.currentConditions.conditions;

            return convertCelcius(weatherTempF)
              .then((weatherTemperature) => {
                const currentWeather = {
                  description: condition,
                  temperature: Number(weatherTemperature.toFixed(1)),
                };

                const data = {
                  ...item._doc,
                  testimonial,
                  currentWeather,
                };

                const responseData = {
                  message: "Success",
                  ...data,
                  currentWeather,
                };

                res.status(200).json(responseData);
              })
              .catch((error) => {
                // console.error(error);
                res.status(404).json("Failed to convert temperature");
              });
          } else {
            res.status(401).json("Failed to fetch current weather data");
          }
        })
        .catch((err) => {
          // console.error(err);
          res.status(402).json({
            message: "Item Tidak Tersedia",
          });
        });
    } catch (error) {
      res.status(500).json({
        message: "Item Tidak Tersedia",
      });
    }
  },

  bookingPage: async (req, res) => {
    const {
      idItem,
      duration,
      startDateBooking,
      endDateBooking,
      total,
      bankName,
      nameAccountBank,
      members,
    } = req.body;

    if (!req.file) {
      return res.status(401).json({ message: "Image Not Found" });
    }
    if (
      idItem === undefined ||
      duration === undefined ||
      startDateBooking === undefined ||
      endDateBooking === undefined ||
      bankName === undefined ||
      nameAccountBank === undefined ||
      members === undefined
    ) {
      return res.status(402).json({ message: "Lengkapi semua field" });
    }
    const item = await Item.findOne({ _id: idItem });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    // const tracks=item.trackId[0].name;
    // console.log(item)
    item.sumBooking += 1;

    await item.save();
    const idTrack = item.trackId[0]._id;
    const findTrack = await Track.findOne({ _id: idTrack });
    const trackName = findTrack.name;
    // console.log(trackName)

    const invoice = await generateInvoice();

    const memberData = [];
    for (const member of members) {
      const {
        nameMember,
        addressMember,
        noIdMember,
        phoneMember,
        emailMember,
        genderMember,
      } = member;
      const newMember = await Member.create({
        nameMember,
        addressMember,
        noIdMember,
        phoneMember,
        emailMember,
        genderMember,
      });
      // console.log(memberData)
      memberData.push(newMember._id);
    }

    const newBooking = {
      invoice: invoice,
      bookingStartDate: startDateBooking,
      bookingEndDate: endDateBooking,
      memberId: memberData,
      total: total,
      track: trackName,
      itemId: {
        _id: item._id,
        title: item.title,
        price: item.price,
        duration: duration,
      },
      payments: {
        proofPayment: `images/${req.file.filename}`,
        bankFrom: bankName,
        accountHolder: nameAccountBank,
      },
    };

    const booking = await Booking.create(newBooking);
    item.memberId.push(...memberData);
    await item.save();

    const userer = await Users.findOne({ itemId: { $in: [idItem] } });

    console.log(userer);
    userer.bookingId.push(booking._id);
    await userer.save();
    res.status(200).json({
      message: "Success Booking",
      booking,
    });
  },
};
