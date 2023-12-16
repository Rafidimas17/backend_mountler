const express = require("express");
const app = express();
const {
  DaftarUser,
  LoginUser,
  getSingleUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require("../../controllers/users/userController");
const authorization = require("../../middleware/authorization");
const {
  runValidation,
  validationDaftar,
  validationLogin,
} = require("../../validator/validator");
const middleware = require("../../middleware/middleware");
app.post("/signup", authorization, validationDaftar, runValidation, DaftarUser);
app.post("/login", authorization, LoginUser, validationLogin, runValidation);
app.get("/get-user", authorization, getSingleUser, middleware);
app.put("/forgot-password", authorization, forgotPassword);
app.put("/reset-password", authorization, resetPassword);
app.get("/verify-email/:tokenAktif/", authorization, verifyEmail);

module.exports = app;
