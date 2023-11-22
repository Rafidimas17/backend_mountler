const Item = require("../../models/Item");
const Treveler = require("../../models/Member");
const Category = require("../../models/Category");
const Image = require("../../models/Image");
const Booking = require("../../models/Booking");
const Equipment = require("../../models/Equipment");
const Users = require("../../models/Users");
const Member = require("../../models/Member");
const Porter = require("../../models/Porter");
const axios = require("axios");
const crypto = require("crypto");
const qrcode = require("qrcode");
const fs = require("fs").promises;
const path = require("path");
const Profile = require("../../models/Profile");
const Track = require("../../models/Track");
const Review = require("../../models/Review");
const Content = require("../../models/Content");

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
  const prefix = "MT";
  const remainingLength = 6; // Panjang karakter acak yang diinginkan

  let invoice = prefix;

  for (let i = 0; i < remainingLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    invoice += characters.charAt(randomIndex);
  }

  return invoice;
}

async function convertCelcius(value) {
  const celcius = ((value - 32) * 5) / 9;
  return celcius;
}

async function fetchDataPayment(
  total,
  invoice,
  memberName,
  memberEmail,
  memberPhone,
  memberAddress,
  name_item
) {
  try {
    const response = await axios.post(
      "https://app.sandbox.midtrans.com/snap/v1/transactions",
      {
        transaction_details: {
          order_id: invoice,
          gross_amount: total,
        },
        item_details: [
          {
            id: invoice,
            price: total,
            quantity: 1,
            name: name_item,
            brand: "Mountler",
            category: "Pendakian",
            merchant_name: "Mountler",
            url: "https://mountler.com",
          },
        ],
        customer_details: {
          first_name: memberName,
          last_name: "",
          email: memberEmail,
          phone: memberPhone,
          billing_address: {
            first_name: memberName,
            last_name: "",
            email: memberEmail,
            phone: memberPhone,
            address: memberAddress,
            city: "",
            postal_code: "",
            country_code: "IDN",
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic U0ItTWlkLXNlcnZlci1IT0Fvd3pFVkhXQld5bElNUGttZlJPQVE6",
        },
      }
    );

    const dataPay = response.data.redirect_url;
    return dataPay;
  } catch (error) {
    console.error("Error in fetchDataPayment:", error.response);
    throw error;
  }
}

async function changeDate(data) {
  const inputDate = new Date(data);
  const day = inputDate.getUTCDate();
  const month = inputDate.toLocaleString("default", { month: "long" });
  const year = inputDate.getUTCFullYear();

  const formattedDate = `${day} ${month} ${year}`;
  return formattedDate;
}

// Function to decrypt using AES-128
async function decrypt(encryptedText) {
  const key = "8315dcf89efe45c1"; // Replace with your actual key
  const iv = Buffer.from("87e7d58225acbed903be44242158f18f", "hex"); // Replace with your actual IV
  const decipher = crypto.createDecipheriv("aes-128-cbc", Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
}

async function generateQRCode(text, fileName, condition, invoice) {
  try {
    // Buat QR code dari teks dengan versi 5
    const qrData = await qrcode.toDataURL(text, { version: 6 });
    const stringRandom = crypto
      .randomBytes(Math.ceil(10 / 2))
      .toString("hex")
      .slice(0, 10);
    // Simpan QR code di dalam folder "public/images/qr-code" dalam format PNG
    const imagePath = path.join(
      __dirname,
      "../../public/images/qr-code",
      `${fileName}_${condition}_${invoice}_${stringRandom}.png`
    );

    // Decode base64 data dan simpan ke file
    const data = qrData.replace(/^data:image\/png;base64,/, "");
    await fs.writeFile(imagePath, data, "base64");
    const relativePath = `/images/qr-code/${path.basename(imagePath)}`;
    return relativePath;
  } catch (error) {
    console.log(error);
  }
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
          options: {
            sort: {
              sumBooking: -1,
            },
          },
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
          res.status(402).json({ message: "Item Tidak Tersedia" });
        });
    } catch (error) {
      res.status(500).json({ message: "Item Tidak Tersedia" });
    }
  },

  bookingPage: async (req, res) => {
    const {
      token,
      idItem,
      duration,
      startDateBooking,
      endDateBooking,
      equipments,
      members,
    } = req.body;

    if (
      !token ||
      !idItem ||
      !duration ||
      !startDateBooking ||
      !endDateBooking ||
      !equipments ||
      !members
    ) {
      console.log(
        token,
        idItem,
        duration,
        startDateBooking,
        endDateBooking,
        equipments,
        members
      );
      return res.status(400).json({ message: "Lengkapi semua field" });
    }
    const item = await Item.findOne({ _id: idItem });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    // const tracks=item.trackId[0].name; console.log(item)
    item.sumBooking += 1;
    const parts = token.split(".");
    const payloadBase64 = parts[1];
    const payloadJSON = JSON.parse(
      Buffer.from(payloadBase64, "base64").toString("utf8")
    );

    const idProfile = payloadJSON.id;
    // const idProfile = payloadJSON.username;

    await item.save();
    const findProfile = await Profile.findOne({ _id: idProfile });
    const profileId = findProfile._id;

    const profileUsername = findProfile.username;
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
    const price = memberData.length * item.price * duration;

    const equipmentData = [];
    for (const equipment of equipments) {
      const {
        jumlahTenda,
        jumlahKompor,
        jumlahMatras,
        jumlahP3k,
        jumlahSleepingBag,
        jumlahCarrier,
        jumlahHeadlamp,
      } = equipment;
      const newEquipment = await Equipment.create({
        jumlahTenda,
        jumlahKompor,
        jumlahMatras,
        jumlahP3k,
        jumlahSleepingBag,
        jumlahCarrier,
        jumlahHeadlamp,
      });

      equipmentData.push(newEquipment._id);
    }
    const idMember = memberData[0];
    const findMember = await Member.findOne({ _id: idMember });
    const memberName = findMember.nameMember;
    const memberEmail = findMember.emailMember;
    const memberPhone = findMember.phoneMember;
    const memberAddress = findMember.addressMember;
    const name_item = item.title;
    const data_url = await fetchDataPayment(
      price,
      invoice,
      memberName,
      memberEmail,
      memberPhone,
      memberAddress,
      name_item
    );

    const newBooking = {
      invoice: invoice,
      bookingStartDate: startDateBooking,
      bookingEndDate: endDateBooking,
      memberId: memberData,
      EquipmentId: equipmentData,
      total: price,
      track: trackName,
      itemId: {
        _id: item._id,
        title: item.title,
        price: item.price,
        duration: duration,
      },
      profileId: {
        _id: profileId,
        username: profileUsername,
      },
      payments: {
        payment_status: "waiting",
        midtrans_url: data_url,
        midtrans_booking_code: "",
      },
      boarding: {
        boarding_status: "Registrasi",
      },
    };

    const booking = await Booking.create(newBooking);
    console.log(booking);
    item.memberId.push(...memberData);
    await item.save();

    const userer = await Users.findOne({
      itemId: {
        $in: [idItem],
      },
    });
    userer.bookingId.push(booking._id);
    await userer.save();
    res.status(200).json({ message: "Success Booking", booking });
  },
  viewDashboard: async (req, res) => {
    const { id } = req.params;

    try {
      const findDataMember = await Booking.find({ "profileId._id": id });

      if (findDataMember && findDataMember.length > 0) {
        const findPorter = await Porter.findOne({
          bookingId: findDataMember.invoice,
        });

        // Transform data structure
        const transformedData = findDataMember.map((booking) => {
          const {
            _id,
            invoice,
            bookingStartDate,
            bookingEndDate,
            payments,
            itemId,
            boarding,
          } = booking;

          return {
            _id,
            invoice,
            bookingStartDate,
            bookingEndDate,
            payments,
            itemId,
            boarding,
          };
        });

        res.status(200).json(transformedData);
      } else {
        res.status(404).json({ message: "Data member tidak ditemukan" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Terjadi kesalahan server" });
    }
  },

  ticketShow: async (req, res) => {
    const { id } = req.params;
    try {
      const findMember = await Booking.findOne({ _id: id }).populate(
        "memberId"
      );
      const findPorter = await Booking.findOne({ _id: id }).populate(
        "porterId"
      );

      const startDate = await changeDate(findMember.bookingStartDate);
      const endDate = await changeDate(findMember.bookingEndDate);
      const item = findMember.itemId.title;
      const duration = findMember.itemId.duration;
      const track = findMember.track;
      const invoice = findMember.invoice;
      const memberData = findMember.memberId;
      const memberName = [];
      const memberNoId = [];
      const qr_start = [];
      const dataName = "";
      const qr_end = [];
      const data_user = [];
      const key = id.slice(0, 16);

      // Fungsi untuk mengenkripsi data
      async function processMemberData() {
        for (let i = 0; i < memberData.length; i++) {
          memberName.push(memberData[i].nameMember);
          memberNoId.push(memberData[i].noIdMember);
          const plaintext_start = id.concat(memberData[i].nameMember);
          const qr_data_start = await encrypt(plaintext_start, key);
          const namaSplit = memberData[i].nameMember.split(" ");
          const nameValue = namaSplit[0];
          const condition_start = "start";

          const qrCodeFileName = `${nameValue
            .toLowerCase()
            .replace(/\s/g, "_")}`;
          const fileName = await generateQRCode(
            qr_data_start,
            qrCodeFileName,
            condition_start,
            invoice
          );
          const imageUrlStart = fileName;

          const data_qr_start = await Image.create({
            imageUrl: imageUrlStart,
          });
          qr_start.push(imageUrlStart);
          findMember.imageQRStart.push(data_qr_start._id);
          await findMember.save();

          const plaintext_end = id.concat(memberData[i].nameMember);
          const qr_data_end = await encrypt(plaintext_end, key);
          const condition_end = "end";
          const imageUrlEnd = await generateQRCode(
            qr_data_end,
            qrCodeFileName,
            condition_end,
            invoice
          );
          const data_qr_end = await Image.create({
            imageUrl: imageUrlEnd,
          });
          qr_end.push(imageUrlEnd);
          findMember.imageQREnd.push(data_qr_end._id);
          await findMember.save();
        }

        for (let i = 0; i < memberName.length; i++) {
          const anggota = {
            nama: memberName[i],
            no_id: memberNoId[i],
            qrStart: qr_start[i],
            qrEnd: qr_end[i],
          };

          data_user.push(anggota);
        }
      }

      // Panggil fungsi async untuk memproses data anggota dan tunggu hingga selesai
      await processMemberData();

      const data_porter = findPorter.porterId.map(
        ({ name, noHandphone, id, price }) => ({
          id,
          name,
          noHandphone,
          total: price * duration,
        })
      );

      const data = {
        porterData: data_porter,
        memberData: data_user, // Menggunakan data_user yang telah diisi
        item,
        invoice,
        status: findMember.boarding.boarding_status,
        track,
        startDate,
        endDate,
        duration,
      };

      return res.status(200).json({ status: "success", payload: data });
    } catch (error) {
      console.log(error);
    }
  },

  viewProfile: async (req, res) => {
    const { id } = req.params;
    try {
      const findProfile = await Profile.findOne({ _id: id });

      res.status(200).json({ message: "success", payload: findProfile });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getPorter: async (req, res) => {
    const { invoice } = req.params;
    try {
      const bookingDetails = await Booking.findOne({ invoice: invoice });
      const itemFind = await Item.findOne({ _id: bookingDetails.itemId._id })
        .select("porterId")
        .populate("porterId");

      const filteredPorterId = itemFind.porterId
        .filter((porter) => porter.status === "free" || !porter.startBooking)
        .map(({ status, name, age, imageUrl, noHandphone, id, price }) => ({
          id,
          status,
          name,
          age,
          price,
          imageUrl,
          noHandphone,
        }));

      res.status(200).json({
        status: "success",
        payload: filteredPorterId.map((porter) => ({
          id: porter.id,
          status: porter.status,
          name: porter.name,
          age: porter.age,
          price: porter.price,
          imageUrl: porter.imageUrl,
          noHandphone: porter.noHandphone,
          invoice: invoice,
          startDate: bookingDetails.bookingStartDate,
          endDate: bookingDetails.bookingEndDate,
          title: bookingDetails.itemId.title,
          duration: bookingDetails.itemId.duration,
        })),
      });
    } catch (error) {
      console.log(error);
    }
  },

  orderPorter: async (req, res) => {
    const { id, invoice } = req.body;
    try {
      const BookingFind = await Booking.findOne({ invoice: invoice });
      // const bookingMember = BookingFind.populate("memberId");
      const findMember = BookingFind.memberId[0];
      const memberData = await Member.findOne({ _id: findMember });

      const findPorter = await Porter.findOne({ _id: id });

      const price = findPorter.price * BookingFind.itemId.duration;
      const memberName = findMember.nameMember;
      const memberEmail = findMember.emailMember;
      const memberPhone = findMember.genderMember;
      const memberAddress = findMember.addressMember;
      const name_item = findPorter.name;
      const data_invoice = btoa(invoice.concat(id));

      const data_url = await fetchDataPayment(
        price,
        data_invoice,
        memberName,
        memberEmail,
        memberPhone,
        memberAddress,
        name_item
      );
      findPorter.payments.payment_url = data_url;
      findPorter.payments.status = "pending";
      findPorter.bookingId.push(invoice);
      findPorter.status = "ordered";
      findPorter.startBooking = BookingFind.bookingStartDate;
      findPorter.endBooking = BookingFind.bookingEndDate;
      await findPorter.save();

      res.status(200).json({
        message: "success",
        payload: "Pesanan berhasil",
        midtrans_url: findPorter.payments.payment_url,
      });
      if (!invoice) {
        res.status(204).json({
          message: "success",
          payload: "Tiket kamu tidak ditemukan",
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
  addReview: async (req, res) => {
    const { url, name, position, content, rate } = req.body;

    const concatenatedString = url;

    // console.log(url, name, position, content, rate, req.file.filename);

    // Split the concatenated string using the separator
    const separator = "asdc!osd3234";
    const parts = concatenatedString.split(separator);

    const decryptedBooking = await decrypt(parts[0]);
    const decryptedBookingItem = await decrypt(parts[1]);
    try {
      const findBooking = await Booking.findOne({ _id: decryptedBooking });

      findBooking.boarding.boarding_status = "Selesai";
      await findBooking.save();

      if (!req.file) {
        res.status(206).json({ message: "Gambar tidak sesuai" });
      }
      const saveImage = await Image.create({
        imageUrl: `images/${req.file.filename}`,
      });

      const saveReview = await Review.create({
        name,
        position,
        rate,
        imageId: saveImage._id,
        content: content,
      });

      const findItem = await Item.findOne({ _id: decryptedBookingItem });
      findItem.reviewId.push(saveReview._id);
      await findItem.save();

      res.status(200).json({ message: "Terimakasih atas revi" });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },
};
