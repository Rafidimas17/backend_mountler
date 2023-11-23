const crypto = require("crypto");

// Assuming you have your AES key and IV
const key = "8315dcf89efe45c1"; // Replace with your actual key
const iv = Buffer.from("87e7d58225acbed903be44242158f18f", "hex"); // Replace with your actual IV

// Function to decrypt using AES-128
function decrypt(encryptedText) {
  const decipher = crypto.createDecipheriv("aes-128-cbc", Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
}

// Your concatenated string
const concatenatedString =
  "440000025cc4f57ca3f249f16c7aa22c645911805d7d922aeeb6bbaeb19f8350asdc!osd32347eddd08a04139070c053e3a1c87f80b3375dee8d46c51b094e7c46280cecb9dc";

// Split the concatenated string using the separator
const separator = "asdc!osd3234";
const parts = concatenatedString.split(separator);

// parts[0] will contain the first part
// parts[1] will contain the second part

// Decrypting the two parts
const decryptedBooking = decrypt(parts[0]);
const decryptedBookingItem = decrypt(parts[1]);

console.log("Decrypted Booking:", decryptedBooking);
console.log("Decrypted Booking Item:", decryptedBookingItem);
