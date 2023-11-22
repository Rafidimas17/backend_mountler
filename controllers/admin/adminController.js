const Category = require("../../models/Category");
const Bank = require("../../models/Bank");
const Item = require("../../models/Item");
const Image = require("../../models/Image");
const Track = require("../../models/Track");
const Feature = require("../../models/Feature");
const Activity = require("../../models/Activity");
const NodeWebcam = require("node-webcam");
const Booking = require("../../models/Booking");
const Member = require("../../models/Member");
const Users = require("../../models/Users");
const Porter = require("../../models/Porter");
const fs = require("fs-extra");
const path = require("path");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const moment = require("moment-timezone");

// Atur zona waktu ke GMT+7 (Waktu Indonesia Barat)
moment.tz.setDefault("Asia/Jakarta");

const Description = require("../../models/Description");

async function decrypt(encrypted, key) {
  const decipher = crypto.createDecipheriv(
    "aes-128-cbc",
    key,
    Buffer.alloc(16, 0)
  );
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

async function getTimeAndDate() {
  const originalTimestamp = moment.tz("Asia/Jakarta"); // Your original timestamp

  const originalDate = new Date(originalTimestamp);

  originalDate.setHours(originalDate.getHours() + 7);

  if (originalDate.getHours() >= 24) {
    originalDate.setHours(originalDate.getHours() - 24);
  }

  const modifiedTimestamp = originalDate.toISOString();
  return modifiedTimestamp;
}

module.exports = {
  viewSignin: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      if (req.session.user == null || req.session.user == undefined) {
        res.render("index", { alert, title: "Cakrawala | Login" });
      } else {
        res.redirect("/admin/dashboard");
      }
    } catch (error) {
      res.redirect("/admin/signin");
    }
  },

  actionSignin: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await Users.findOne({ username: username });
      const item = await Item.findOne({ _id: user.itemId });
      // console.log(item);
      if (!user) {
        req.flash("alertMessage", "User yang anda masukan tidak ada!!");
        req.flash("alertStatus", "danger");
        res.redirect("/admin/signin");
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        req.flash("alertMessage", "Password yang anda masukan tidak cocok!!");
        req.flash("alertStatus", "danger");
        res.redirect("/admin/signin");
      }

      req.session.user = {
        id: user.id,
        username: user.username,
        itemId: user.itemId,
        organizer: user.organizer,
      };

      res.redirect("/admin/dashboard");
    } catch (error) {
      res.redirect("/admin/signin");
    }
  },

  actionLogout: (req, res) => {
    req.session.destroy();
    res.redirect("/admin/signin");
  },

  viewDashboard: async (req, res) => {
    try {
      const user = await Users.findOne({ _id: req.session.user.id });
      const item = await Item.find({ _id: user.itemId });
      const member = await Member.find();
      // console.log(item)
      const booking = await Booking.find({ _id: user.bookingId });
      const filteredBooking = booking.filter(
        (item) => item.payments.status === "Accept"
      );
      const mapItem = filteredBooking.map((item) => item.total);
      const total = mapItem.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );
      // console.log(sum) const steps = [   { label: "Step 1" },   { label: "Step 2"
      // },   { label: "Step 3" }, ]; const currentStep = 1;

      res.render("admin/dashboard/view_dashboard", {
        title: "Cakrawala | Dashboard",
        user,
        member,
        total,
        item,
      });
      // console.log()
    } catch (error) {
      res.redirect("/admin/dashboard");
    }
  },

  viewCategory: async (req, res) => {
    try {
      const user = await Users.findOne({ _id: req.session.user.id });
      const category = await Category.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      res.render("admin/category/view_category", {
        category,
        alert,
        title: "Cakrawala | Category",
        user,
      });
    } catch (error) {
      res.redirect("/admin/category");
    }
  },

  addCategory: async (req, res) => {
    try {
      const { name } = req.body;
      // console.log(name);
      // console.log(name);
      await Category.create({ name });
      req.flash("alertMessage", "Success Add Category");
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },

  editCategory: async (req, res) => {
    try {
      const { id, name } = req.body;
      const category = await Category.findOne({ _id: id });
      category.name = name;
      await category.save();
      req.flash("alertMessage", "Success Update Category");
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findOne({ _id: id });
      await category.remove();
      req.flash("alertMessage", "Success Delete Category");
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },

  viewBank: async (req, res) => {
    try {
      const user = await Users.findOne({ _id: req.session.user.id });
      const item = await Item.find({ _id: user.itemId });
      const bank = await Bank.find({ itemId: item });
      // console.log(bank); console.log(item)
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      res.render("admin/bank/view_bank", {
        title: "Cakrawala | Bank",
        alert,
        bank,
        user,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },

  addBank: async (req, res) => {
    try {
      const { name, nameBank, nomorRekening } = req.body;
      const user = await Users.findOne({ _id: req.session.user.id });
      // const userId = req.session.user.id;
      const item = await Item.findOne({ _id: user.itemId });
      // const userId = req.session.user.id; // Ubah req.session.user.id menjadi
      // userId
      const bankItem = {
        name,
        nameBank,
        nomorRekening,
        itemId: item,
      };

      const bank = await Bank.create(bankItem);

      const itemBank = await Item.findOne({ _id: item });
      itemBank.bankId.push(bank._id);
      await itemBank.save();

      req.flash("alertMessage", "Success Add Bank");
      req.flash("alertStatus", "success");
      res.redirect("/admin/bank");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },

  editBank: async (req, res) => {
    try {
      const { id, name, nameBank, nomorRekening } = req.body;
      const bank = await Bank.findOne({ _id: id });

      bank.name = name;
      bank.nameBank = nameBank;
      bank.nomorRekening = nomorRekening;

      await bank.save();
      req.flash("alertMessage", "Success Update Bank");
      req.flash("alertStatus", "success");
      res.redirect("/admin/bank");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },

  deleteBank: async (req, res) => {
    try {
      const { id } = req.params;
      await Bank.deleteOne({ _id: id });
      await Item.updateMany(
        {
          bankId: id,
        },
        {
          $pull: {
            bankId: id,
          },
        }
      );
      req.flash("alertMessage", "Success Delete Bank");
      req.flash("alertStatus", "success");
      res.redirect("/admin/bank");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },

  viewItem: async (req, res) => {
    try {
      const user = await Users.findOne({ _id: req.session.user.id });
      // console.log(user)
      const item = await Item.find({ _id: user.itemId })
        .populate({ path: "imageId", select: "id imageUrl" })
        .populate({ path: "categoryId", select: "id name" });
      //  console.log(item) const trackData = await Track.find();

      const category = await Category.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      res.render("admin/item/view_item", {
        title: "Cakrawala | Item",
        category,
        alert,
        item,
        action: "view",
        user,
      });
      // console.log(item.trackId);
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  addItem: async (req, res) => {
    try {
      const { categoryId, price, title, about, highest } = req.body;

      const userId = req.session.user.id;
      const newItem = {
        categoryId,
        title,
        price,
        description: about,
        highest,
        userId: userId,
      };

      const item = await Item.create(newItem);

      const category = await Category.findOne({ _id: categoryId });
      category.itemId.push(item._id);
      await category.save();

      // Tambahkan item ke array itemId pada user
      const user = await Users.findOne({ _id: userId });
      user.itemId.push(item._id);
      await user.save();

      for (let i = 0; i < req.files.length; i++) {
        const imageSave = await Image.create({
          imageUrl: `images/${req.files[i].filename}`,
        });
        item.imageId.push(imageSave._id);
        await item.save();
      }

      req.flash("alertMessage", "Success Add Item");
      req.flash("alertStatus", "success");
      res.redirect("/admin/item");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  showImageItem: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await Users.findOne({ _id: req.session.user.id });
      const item = await Item.findOne({ _id: id }).populate({
        path: "imageId",
        select: "id imageUrl",
      });
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      res.render("admin/item/view_item", {
        title: "Cakrawala | Show Image Item",
        alert,
        item,
        action: "show image",
        user,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  showEditItem: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await Users.findOne({ _id: req.session.user.id });
      // const user = req.session.user;
      const item = await Item.findOne({ _id: id })
        .populate({ path: "imageId", select: "id imageUrl" })
        .populate({ path: "categoryId", select: "id name" });
      const category = await Category.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      // console.log(item);
      res.render("admin/item/view_item", {
        title: "Cakrawala | Edit Item",
        alert,
        item,
        category,
        action: "edit",
        user,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  editItem: async (req, res) => {
    try {
      const { id } = req.params;

      const { categoryId, title, price, about, highest } = req.body;
      const item = await Item.findOne({ _id: id })
        .populate({ path: "imageId", select: "id imageUrl" })
        .populate({ path: "categoryId", select: "id name" });

      if (req.files.length > 0) {
        for (let i = 0; i < item.imageId.length; i++) {
          const imageUpdate = await Image.findOne({ _id: item.imageId[i]._id });
          await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`));
          imageUpdate.imageUrl = `images/${req.files[i].filename}`;
          await imageUpdate.save();
        }
        item.title = title;
        item.price = price;

        item.highest = highest;
        item.description = about;
        item.categoryId = categoryId;
        await item.save();
        req.flash("alertMessage", "Success update Item");
        req.flash("alertStatus", "success");
        res.redirect("/admin/item");
      } else {
        item.title = title;
        item.price = price;
        item.highest = highest;

        item.description = about;
        item.categoryId = categoryId;
        await item.save();
        req.flash("alertMessage", "Success update Item");
        req.flash("alertStatus", "success");
        res.redirect("/admin/item");
      }
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  deleteItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id }).populate("imageId");
      for (let i = 0; i < item.imageId.length; i++) {
        Image.findOne({ _id: item.imageId[i]._id })
          .then((image) => {
            fs.unlink(path.join(`public/${image.imageUrl}`));
            image.remove();
          })
          .catch((error) => {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/admin/item");
          });
      }
      await item.remove();
      req.flash("alertMessage", "Success delete Item");
      req.flash("alertStatus", "success");
      res.redirect("/admin/item");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  viewDetailItem: async (req, res) => {
    const { itemId } = req.params;
    try {
      const alertMessage = req.flash("alertMessage");
      const user = await Users.findOne({ _id: req.session.user.id });
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };

      const feature = await Feature.find({ itemId: itemId });
      const activity = await Activity.find({ itemId: itemId });

      res.render("admin/item/detail_item/view_detail_item", {
        title: "Cakrawala | Detail Item",
        alert,
        itemId,
        feature,
        activity,
        user,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },
  addFeature: async (req, res) => {
    const { name, qty, itemId } = req.body;

    try {
      if (!req.file) {
        req.flash("alertMessage", "Image not found");
        req.flash("alertStatus", "danger");
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      }
      const feature = await Feature.create({
        name,
        qty,
        itemId,
        imageUrl: `images/${req.file.filename}`,
      });

      const item = await Item.findOne({ _id: itemId });
      item.featureId.push({ _id: feature._id });
      await item.save();
      req.flash("alertMessage", "Success Add Feature");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  editFeature: async (req, res) => {
    const { id, name, qty, itemId } = req.body;
    try {
      const feature = await Feature.findOne({ _id: id });
      if (req.file == undefined) {
        feature.name = name;
        feature.qty = qty;
        await feature.save();
        req.flash("alertMessage", "Success Update Feature");
        req.flash("alertStatus", "success");
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      } else {
        await fs.unlink(path.join(`public/${feature.imageUrl}`));
        feature.name = name;
        feature.qty = qty;
        feature.imageUrl = `images/${req.file.filename}`;
        await feature.save();
        req.flash("alertMessage", "Success Update Feature");
        req.flash("alertStatus", "success");
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  deleteFeature: async (req, res) => {
    const { id, itemId } = req.params;
    try {
      const feature = await Feature.findOne({ _id: id });

      const item = await Item.findOne({ _id: itemId }).populate("featureId");
      for (let i = 0; i < item.featureId.length; i++) {
        if (item.featureId[i]._id.toString() === feature._id.toString()) {
          item.featureId.pull({ _id: feature._id });
          await item.save();
        }
      }
      await fs.unlink(path.join(`public/${feature.imageUrl}`));
      await feature.remove();
      req.flash("alertMessage", "Success Delete Feature");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  addActivity: async (req, res) => {
    const { name, type, itemId } = req.body;

    try {
      if (!req.file) {
        req.flash("alertMessage", "Image not found");
        req.flash("alertStatus", "danger");
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      }
      const activity = await Activity.create({
        name,
        type,
        itemId,
        imageUrl: `images/${req.file.filename}`,
      });

      const item = await Item.findOne({ _id: itemId });
      item.activityId.push({ _id: activity._id });
      await item.save();
      req.flash("alertMessage", "Success Add Activity");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  editActivity: async (req, res) => {
    const { id, name, type, itemId } = req.body;
    try {
      const activity = await Activity.findOne({ _id: id });
      if (req.file == undefined) {
        activity.name = name;
        activity.type = type;
        await activity.save();
        req.flash("alertMessage", "Success Update activity");
        req.flash("alertStatus", "success");
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      } else {
        await fs.unlink(path.join(`public/${activity.imageUrl}`));
        activity.name = name;
        activity.type = type;
        activity.imageUrl = `images/${req.file.filename}`;
        await activity.save();
        req.flash("alertMessage", "Success Update activity");
        req.flash("alertStatus", "success");
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  deleteActivity: async (req, res) => {
    const { id, itemId } = req.params;
    try {
      const activity = await Activity.findOne({ _id: id });

      const item = await Item.findOne({ _id: itemId }).populate("activityId");
      for (let i = 0; i < item.activityId.length; i++) {
        if (item.activityId[i]._id.toString() === activity._id.toString()) {
          item.activityId.pull({ _id: activity._id });
          await item.save();
        }
      }
      await fs.unlink(path.join(`public/${activity.imageUrl}`));
      await activity.remove();
      req.flash("alertMessage", "Success Delete Activity");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  viewBooking: async (req, res) => {
    try {
      const user = await Users.findOne({ _id: req.session.user.id });
      const booking = await Booking.find({ _id: user.bookingId })
        .populate("memberId")
        .populate("bankId");
      booking.sort((a, b) => b.createdAt - a.createdAt);
      res.render("admin/booking/view_booking", {
        title: "Cakrawala | Booking",
        user,
        booking,
      });
    } catch (error) {
      console.log(error);
      // res.redirect("/admin/booking");
    }
  },

  showDetailBooking: async (req, res) => {
    const { id } = req.params;
    const user = await Users.findOne({ _id: req.session.user.id });
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };

      const booking = await Booking.findOne({ _id: id })
        .populate("memberId")
        .populate("bankId");

      res.render("admin/booking/show_detail_booking", {
        title: "Cakrawala | Detail Booking",
        user,
        booking,
        alert,
      });
    } catch (error) {
      res.redirect("/admin/booking");
    }
  },

  actionConfirmation: async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await Booking.findOne({ _id: id });
      booking.payments.status = "Accept";
      await booking.save();

      req.flash("alertMessage", "Success Confirmation Pembayaran");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/booking/${id}`);
    } catch (error) {
      res.redirect(`/admin/booking/${id}`);
    }
  },

  actionReject: async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await Booking.findOne({ _id: id });
      booking.payments.status = "Reject";
      await booking.save();
      req.flash("alertMessage", "Success Reject Pembayaran");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/booking/${id}`);
    } catch (error) {
      res.redirect(`/admin/booking/${id}`);
    }
  },
  viewTrack: async (req, res) => {
    try {
      const user = await Users.findOne({ _id: req.session.user.id });
      const item = await Item.findOne({ _id: user.itemId });
      const track = await Track.find({ itemId: item });

      // console.log(item)
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      res.render("admin/track/view_track", {
        title: "Cakrawala | Track",
        alert,
        track,
        user,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },
  addTrack: async (req, res) => {
    try {
      const { province, regency, district, villages, track } = req.body;
      const user = await Users.findOne({ _id: req.session.user.id });
      const item = await Item.findOne({ _id: user.itemId });
      const provinceResponse = await axios.get(
        `https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json`
      );
      const provinceName = provinceResponse.data
        .find((prov) => prov.id === province)
        .name.toLowerCase()
        .replace(/\b\w/g, (match) => match.toUpperCase());
      // console.log(provinceName);

      const regencyResponse = await axios.get(
        `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${province}.json`
      );
      // console.log(regencyResponse);
      const cityData = regencyResponse.data.find(
        (regencies) => regencies.id === regency
      );
      const cityName = cityData.name.replace(
        /(KABUPATEN|kabupaten|KOTA|kota)\s*/g,
        ""
      );
      const nameCity =
        cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();

      const districtResponse = await axios.get(
        `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${regency}.json`
      );
      const districtData = districtResponse.data.find(
        (districts) => districts.id === district
      );
      const districtName =
        districtData.name.charAt(0).toUpperCase() +
        districtData.name.slice(1).toLowerCase();
      // console.log(districtName);

      const villageResponse = await axios.get(
        `https://www.emsifa.com/api-wilayah-indonesia/api/villages/${district}.json`
      );
      const villageData = villageResponse.data.find(
        (village) => village.id === villages
      );
      const villageName =
        villageData.name.charAt(0).toUpperCase() +
        villageData.name.slice(1).toLowerCase();
      const trackSave = {
        name: track,
        province: provinceName,
        district: districtName,
        village: villageName,
        city: nameCity,
        itemId: item,
      };
      const trackItem = await Track.create(trackSave);
      const trackers = await Item.findOne({ _id: item });
      trackers.trackId.push(trackItem._id); // Menambahkan ID track ke dalam array trackId di model Item
      await trackers.save();
      req.flash("alertMessage", "Success Add Track");
      req.flash("alertStatus", "success");
      res.redirect("/admin/track");
      // console.log(villageName);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/track");
    }
  },
  deleteTrack: async (req, res) => {
    try {
      const { id } = req.params;
      await Track.deleteOne({ _id: id });
      await Item.updateMany(
        {
          trackId: id,
        },
        {
          $pull: {
            trackId: id,
          },
        }
      );

      req.flash("alertMessage", "Success delete Item");
      req.flash("alertStatus", "success");
      res.redirect("/admin/track");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/track");
    }
  },
  editTrack: async (req, res) => {
    try {
      const { id, track, province, city, district, village } = req.body;
      const tracks = await Track.findOne({ _id: id });

      tracks.name = track;
      tracks.province = province;
      tracks.city = city;
      tracks.district = district;
      tracks.village = village;

      await tracks.save();
      req.flash("alertMessage", "Success Update Track");
      req.flash("alertStatus", "success");
      res.redirect("/admin/track");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/track");
    }
  },
  viewPengelola: async (req, res) => {
    try {
      const user = await Users.findOne({ _id: req.session.user.id });
      const users = await Users.find();
      // const item = await Item.findOne({ _id: user.itemId }); const track = await
      // Track.find({ itemId: item }); console.log(item)
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      res.render("admin/pengelola/view_pengelola", {
        title: "Cakrawala | Pengelola",
        alert,
        users,
        user,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/pengelola");
    }
  },
  addPengelola: async (req, res) => {
    try {
      const { username, password, namaGunung, noTelepon, alamat } = req.body;
      const addUser = {
        username: username,
        password,
        password,
        organizer: namaGunung,
        role: "pengelola",
        noPhone: noTelepon,
        address: alamat,
      };
      await Users.create(addUser);
      req.flash("alertMessage", "Sukses Tambah Pengelola");
      req.flash("alertStatus", "success");
      res.redirect("/admin/pengelola");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/pengelola");
    }
  },
  viewExample: async (req, res) => {
    res.render("admin/example/view_example");
  },
  viewStatus: async (req, res) => {
    try {
      const user = await Users.findOne({ _id: req.session.user.id });
      const booking = await Booking.find({ _id: user.bookingId });

      // const user = await Users.findOne({ _id: req.session.user.id }); const item =
      // await Item.findOne({ _id: user.itemId }); const track = await Track.find({
      // itemId: item }); console.log(item)
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      booking.sort((a, b) => b.createdAt - a.createdAt);
      res.render("admin/status/view_status", {
        title: "Cakrawala | Status",
        alert,
        user,
        booking,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/pengelola");
    }
  },
  viewDetailStatus: async (req, res) => {
    const { bookingId } = req.params;
    try {
      const alertMessage = req.flash("alertMessage");
      const user = await Users.findOne({ _id: req.session.user.id });
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      const booking = await Booking.findOne({ _id: bookingId });
      // const feature = await Feature.find({ itemId: itemId }); const  = await
      // Activity.find({ itemId: itemId });
      // console.log(booking);

      res.render("admin/status/detail-status/view_detail_status", {
        title: "Cakrawala | Detail Status",
        alert,
        booking,
        // feature, activity,
        user,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/status/show-detail-status/${bookingId}`);
    }
  },
  deletePengelola: async (req, res) => {
    const { id } = req.params;
    const user = await Users.findOne({ _id: id });
    const item = await Item.findOne({ _id: user.itemId[1] });

    // for(let i=0;i<user.itemId.length;i++){   const item=await
    // Item.find({_id:user.itemId[i]}) }
  },
  scanQrCode: async (req, res) => {
    const { imageUrl } = req.body;

    try {
      const data_invoice_start = imageUrl.match(/start_([^_]+)_/);
      const invoice_start = data_invoice_start ? data_invoice_start[1] : null;

      const data_invoice_end = imageUrl.match(/end_([^_]+)_/); // Fix the regular expression here
      const invoice_end = data_invoice_end ? data_invoice_end[1] : null;

      // Extracting "/images/qr-code/john_start_MT6XNZKY_f70e96c8bf.png"
      const data_image_url = imageUrl.match(/\/images\/qr-code\/([^/]+)$/);
      const image_url = data_image_url ? data_image_url[0] : null;

      const data_status = imageUrl.match(/\/([^_]+)_start_([^_]+)_/);
      const status = data_status ? data_status[2] : null;
      const startCharacter = status ? status.charAt(0) : null;

      // update status based on startCharacter
      var status_booking = startCharacter ? "start" : "end";
      const status_invoice =
        status_booking === "start" ? invoice_start : invoice_end;
      const findImage = await Image.findOne({ imageUrl: image_url });

      const findBooking = await Booking.findOne({
        invoice: status_invoice,
      });
      // console.log(startCharacter,);
      if (status_booking === "start") {
        if (findBooking.imageQRStart.includes(findImage._id)) {
          findBooking.boarding.boarding_status = "check-in";
          const getTime = await getTimeAndDate();
          findBooking.boarding.boarding_start = getTime;
          await findBooking.save();
        } else {
        }
      } else if (status_booking === "end") {
        if (findBooking.imageQREnd.includes(findImage._id)) {
          findBooking.boarding.boarding_status = "check-out";
          const getTime = await getTimeAndDate();
          findBooking.boarding.boarding_end = getTime;
          await findBooking.save();

          for (let i = 0; i < findBooking.porterId.length; i++) {
            const findPorterEnd = await Porter.findOne({
              _id: findBooking.porterId[i],
            });
            findPorterEnd.status = "free";
            findPorterEnd.startBooking = null;
            (findPorterEnd.endBooking = null),
              (findPorterEnd.payments.status = "waiting");
            await findPorterEnd.save();
          }
        }
      } else {
        if (!findImage) {
          // If the image is not found, return a 404 response with an error message
          return res.status(404).json({ message: "Item tidak ditemukan" });
        }
      }

      // Return a success response with the data
      return res.status(200).json({
        message: "Data ditemukan",
        invoice: status_invoice,
        status: status_booking,
        porter: findBooking.porterId,
      });
    } catch (error) {
      console.log(error);
      // Handle other errors if they occur
      res.status(500).json({ message: error.message, status_booking });
    }
  },

  viewPorter: async (req, res) => {
    try {
      const user = await Users.findOne({ _id: req.session.user.id });
      const item = await Item.find({ _id: user.itemId });
      const porter = await Porter.find({ itemId: item });
      // console.log(bank); console.log(item)
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      res.render("admin/porter/view_porter", {
        title: "Cakrawala | Porter",
        alert,
        porter,
        user,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/porter");
    }
  },
  addPorter: async (req, res) => {
    const { name, age, no_hp } = req.body;
    try {
      const user = await Users.findOne({ _id: req.session.user.id });
      // const userId = req.session.user.id;
      const item = await Item.findOne({ _id: user.itemId });

      if (!req.file) {
        res.status(204).json({
          message: "File tidak ditemukan",
        });
      }
      const savePorter = await Porter.create({
        name: name,
        age: age,
        imageUrl: `images/${req.file.filename}`,
        itemId: item,
        noHandphone: no_hp,
      });
      const findItem = await Item.findOne({ _id: savePorter.itemId });
      findItem.porterId.push(savePorter._id);
      await findItem.save();
      req.flash("alertMessage", "Success Add Porter");
      req.flash("alertStatus", "success");
      res.redirect("/admin/porter");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/porter");
    }
  },
  deletePorter: async (req, res) => {
    try {
      const { id } = req.params;
      await Porter.deleteOne({ _id: id });
      await Item.updateMany(
        {
          porterId: id,
        },
        {
          $pull: {
            porterId: id,
          },
        }
      );
      req.flash("alertMessage", "Success Delete Porter");
      req.flash("alertStatus", "success");
      res.redirect("/admin/porter");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/porter");
    }
  },
  editPorter: async (req, res) => {
    const { id, name, age, noHandphone } = req.body;
    try {
      const porter = await Porter.findOne({ _id: id });
      console.log(porter);
      if (!req.file) {
        res.status(203).json({
          message: "Image not found",
        });
      }
      await fs.unlink(path.join(__dirname, `public/${porter.imageUrl}`));

      porter.name = name;
      porter.age = age;
      porter.noHandphone = noHandphone;
      porter.imageUrl = `images/${req.file.filename}`;

      await porter.save();
      req.flash("alertMessage", "Success Update Porter");
      req.flash("alertStatus", "success");
      res.redirect("/admin/porter");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/porter");
    }
  },
};
