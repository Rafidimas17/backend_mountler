const router=require('express').Router()
const { uploadSingle } = require('../../middleware/multer');
const  authorization  = require('../../middleware/authorization');
const apiController=require('../../controllers/api/apiController')

router.get('/landing-page',authorization,apiController.viewLandingPage)
router.get('/detail-page/:id', authorization, apiController.detailPage);
router.post('/booking-page', authorization,uploadSingle, apiController.bookingPage);
module.exports=router;  