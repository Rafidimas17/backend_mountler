const router = require("express").Router();
const adminController = require("../../controllers/admin/adminController");
const { uploadSingle, uploadMultiple } = require("../../middleware/multer");
const auth = require("../../middleware/auth");

router.get("/signin", adminController.viewSignin);
router.post("/signin", adminController.actionSignin);

router.get("/logout", adminController.actionLogout);
router.get("/dashboard", adminController.viewDashboard);
//endpoint pengelola

// endpoint category
router.get("/category", adminController.viewCategory);
router.post("/category", adminController.addCategory);
router.put("/category", adminController.editCategory);
router.delete("/category/:id", adminController.deleteCategory);
// endpoint bank
router.get("/bank", adminController.viewBank);
router.post("/bank", uploadSingle, adminController.addBank);
router.put("/bank", uploadSingle, adminController.editBank);
router.delete("/bank/:id", adminController.deleteBank);
// endpoint item
router.get("/item", adminController.viewItem);
router.post("/item", uploadMultiple, adminController.addItem);
router.get("/item/show-image/:id", adminController.showImageItem);
router.get("/item/:id", adminController.showEditItem);
router.put("/item/:id", uploadMultiple, adminController.editItem);
router.delete("/item/:id/delete", adminController.deleteItem);

//endpoint track
router.get("/track", adminController.viewTrack);
router.post("/track", adminController.addTrack);
router.delete("/track/:id", adminController.deleteTrack);
router.put("/track", adminController.editTrack);

//endpoint pengelola
router.get("/pengelola", adminController.viewPengelola);
router.post("/pengelola", adminController.addPengelola);
router.delete("/pengelola/:id", adminController.deletePengelola);

// endpoint detail item
router.get("/item/show-detail-item/:itemId", adminController.viewDetailItem);
router.post("/item/add/feature", uploadSingle, adminController.addFeature);
router.put("/item/update/feature", uploadSingle, adminController.editFeature);
router.delete("/item/:itemId/feature/:id", adminController.deleteFeature);

router.post("/item/add/activity", uploadSingle, adminController.addActivity);
router.put("/item/update/activity", uploadSingle, adminController.editActivity);
router.delete("/item/:itemId/activity/:id", adminController.deleteActivity);

//endpoint booking
router.get("/booking", adminController.viewBooking);
router.get("/booking/:id", adminController.showDetailBooking);
router.put("/booking/:id/confirmation", adminController.actionConfirmation);
router.put("/booking/:id/reject", adminController.actionReject);

// endpoint status pendakian
router.get("/status", adminController.viewStatus);
router.get(
  "/status/show-detail-status/:bookingId",
  adminController.viewDetailStatus
);
router.get("/status/scan-qr/:id", adminController.scanQrCode);

// router.get("/example", adminController.viewExample);
module.exports = router;
