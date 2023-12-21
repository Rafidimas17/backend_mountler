const router = require("express").Router();
const { uploadSingle } = require("../../middleware/multer");
const authorization = require("../../middleware/authorization");
const apiController = require("../../controllers/api/apiController");
const testController = require("../../controllers/api/testController");

router.get("/landing-page", authorization, apiController.viewLandingPage);
router.get("/detail-page/:id", authorization, apiController.detailPage);
router.post(
  "/booking-page",
  authorization,
  uploadSingle,
  apiController.bookingPage
);
router.get(
  "/ticket-show/:id",
  authorization,
  uploadSingle,
  apiController.ticketShow
);
router.get("/view-profile/:id", authorization, apiController.viewProfile);
router.get("/dashboard/:id", authorization, apiController.viewDashboard);
router.get("/payment-success", testController.getNotification);
router.post("/payment-success", testController.getNotification);
router.get('/fuzzy-topsis',apiController.fuzzyTopsis)

router.get("/list-porter/:invoice", authorization, apiController.getPorter);
router.post("/order-porter", authorization, apiController.orderPorter);
router.post(
  "/add-review",
  authorization,
  uploadSingle,
  apiController.addReview
);

module.exports = router;
