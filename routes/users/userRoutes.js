const express = require("express");
const app = express();
const {
  DaftarUser,
  LoginUser,
  getSingleUser,
  verifyEmail,
  forgotPassword,
  resetPassword
} = require("../../controllers/users/userController");
const {
  runValidation,
  validationDaftar,
  validationLogin,
} = require("../../validator/validator");
const middleware = require("../../middleware/middleware");
app.post("/signup", validationDaftar, runValidation, DaftarUser);
app.post("/login", LoginUser, validationLogin, runValidation);
app.get('/get-user',getSingleUser,middleware)
app.put('/forgot-password',forgotPassword)
app.put('/reset-password',resetPassword)
app.get('/verify-email/:tokenAktif/',verifyEmail)

module.exports = app;
