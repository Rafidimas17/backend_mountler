const { check, validationResult } = require("express-validator");

exports.runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: errors.array()[0].msg,
    });
  }
  next();
};

exports.validationDaftar = [
  check("username", "Username tidak boleh kosong").notEmpty(),
  check(
    "username",
    "Username harus terdiri dari huruf dan angka"
  ).isAlphanumeric(),
  check("email", "Email tidak boleh kosong")
    .notEmpty()
    .isEmail()
    .withMessage("Format email tidak valid"),
  check("password", "Password tidak boleh kosong")
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("Password minimal 8 karakter")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage(
      "Password harus terdiri dari huruf besar, huruf kecil, angka, dan simbol, ex:Contoh01!"
    ),
];

exports.validationLogin = [
  check("username", "Username tidak boleh kosong").notEmpty(),
  check("password", "Password tidak boleh kosong")
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("Password minimal 8 karakter")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage(
      "Password harus terdiri dari huruf besar, huruf kecil, angka, dan simbol"
    ),
];
