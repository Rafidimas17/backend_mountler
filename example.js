const qrcode = require("qrcode");
const fs = require("fs").promises;
const path = require("path");

async function generateQRCode(text, fileName, condition) {
  try {
    // Buat QR code dari teks dengan versi 5
    const qrData = await qrcode.toDataURL(text, { version: 5 });

    // Simpan QR code di dalam folder "public/images/qr-code" dalam format PNG
    const imagePath = path.join(
      __dirname,
      "./images/qr-code",
      `${fileName}_${condition}.png`
    );

    // Decode base64 data dan simpan ke file
    const data = qrData.replace(/^data:image\/png;base64,/, "");
    await fs.writeFile(imagePath, data, "base64");

    // console.log("QR Code tersimpan dengan nama file:", `${fileName}.png`);

    return imagePath; // Mengembalikan lokasi gambar
  } catch (error) {
    console.error("Terjadi kesalahan saat membuat QR code:", error);
    return null;
  }
}

const arr = [];

const encryptedTextStart =
  "b433a8ee5a3d73dce77747beff32a3ebb31114055f6ad995669383b6ae3348e0";
const encryptedTextEnd =
  "cb4be16986518e2c2c9920f0f491f99ee89cdb569bef9a3f798aa3d62beab02c";
const nama = "Eva Imroatul Hasanah";
const namaSplit = nama.split(" ");

const nameValue = namaSplit[0];
const qrCodeFileName = `${nameValue.toLowerCase().replace(/\s/g, "_")}`;
console.log(qrCodeFileName);

generateQRCode(encryptedTextStart, `${qrCodeFileName}_start`)
  .then((startImagePath) => {
    if (startImagePath) {
      console.log("Lokasi gambar QR Code Start:", startImagePath);

      // Buat URL gambar QR Code Start
      const qrStartURL = `/images/qr-code/${qrCodeFileName}_start.png`;

      // Outputkan URL gambar QR Code Start
      console.log("URL gambar QR Code Start:", qrStartURL);

      // Gunakan qrStartURL sesuai kebutuhan Anda
    } else {
      console.log("Gagal membuat QR Code Start.");
    }
  })
  .catch((error) => {
    console.error("Terjadi kesalahan saat membuat QR Code Start:", error);
  });

generateQRCode(encryptedTextEnd, `${qrCodeFileName}_end`)
  .then((endImagePath) => {
    if (endImagePath) {
      console.log("Lokasi gambar QR Code End:", endImagePath);

      // Buat URL gambar QR Code End
      const qrEndURL = `/images/qr-code/${qrCodeFileName}_end.png`;

      // Outputkan URL gambar QR Code End
      console.log("URL gambar QR Code End:", qrEndURL);

      // Gunakan qrEndURL sesuai kebutuhan Anda
    } else {
      console.log("Gagal membuat QR Code End.");
    }
  })
  .catch((error) => {
    console.error("Terjadi kesalahan saat membuat QR Code End:", error);
  });
