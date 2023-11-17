// // const qrcode = require("qrcode");
// // const fs = require("fs").promises;
// // const path = require("path");

// // async function generateQRCode(text, fileName, condition) {
// //   try {
// //     // Buat QR code dari teks dengan versi 5
// //     const qrData = await qrcode.toDataURL(text, { version: 5 });

// //     // Simpan QR code di dalam folder "public/images/qr-code" dalam format PNG
// //     const imagePath = path.join(
// //       __dirname,
// //       "./images/qr-code",
// //       `${fileName}_${condition}.png`
// //     );

// //     // Decode base64 data dan simpan ke file
// //     const data = qrData.replace(/^data:image\/png;base64,/, "");
// //     await fs.writeFile(imagePath, data, "base64");

// //     // console.log("QR Code tersimpan dengan nama file:", `${fileName}.png`);

// //     return imagePath; // Mengembalikan lokasi gambar
// //   } catch (error) {
// //     console.error("Terjadi kesalahan saat membuat QR code:", error);
// //     return null;
// //   }
// // }

// // const arr = [];

// // const encryptedTextStart =
// //   "b433a8ee5a3d73dce77747beff32a3ebb31114055f6ad995669383b6ae3348e0";
// // const encryptedTextEnd =
// //   "cb4be16986518e2c2c9920f0f491f99ee89cdb569bef9a3f798aa3d62beab02c";
// // const nama = "Eva Imroatul Hasanah";
// // const namaSplit = nama.split(" ");

// // const nameValue = namaSplit[0];
// // const qrCodeFileName = `${nameValue.toLowerCase().replace(/\s/g, "_")}`;
// // console.log(qrCodeFileName);

// // generateQRCode(encryptedTextStart, `${qrCodeFileName}_start`)
// //   .then((startImagePath) => {
// //     if (startImagePath) {
// //       console.log("Lokasi gambar QR Code Start:", startImagePath);

// //       // Buat URL gambar QR Code Start
// //       const qrStartURL = `/images/qr-code/${qrCodeFileName}_start.png`;

// //       // Outputkan URL gambar QR Code Start
// //       console.log("URL gambar QR Code Start:", qrStartURL);

// //       // Gunakan qrStartURL sesuai kebutuhan Anda
// //     } else {
// //       console.log("Gagal membuat QR Code Start.");
// //     }
// //   })
// //   .catch((error) => {
// //     console.error("Terjadi kesalahan saat membuat QR Code Start:", error);
// //   });

// // generateQRCode(encryptedTextEnd, `${qrCodeFileName}_end`)
// //   .then((endImagePath) => {
// //     if (endImagePath) {
// //       console.log("Lokasi gambar QR Code End:", endImagePath);

// //       // Buat URL gambar QR Code End
// //       const qrEndURL = `/images/qr-code/${qrCodeFileName}_end.png`;

// //       // Outputkan URL gambar QR Code End
// //       console.log("URL gambar QR Code End:", qrEndURL);

// //       // Gunakan qrEndURL sesuai kebutuhan Anda
// //     } else {
// //       console.log("Gagal membuat QR Code End.");
// //     }
// //   })
// //   .catch((error) => {
// //     console.error("Terjadi kesalahan saat membuat QR Code End:", error);
// //   });

// const crypto = require("crypto");

// // Fungsi untuk menghasilkan kunci acak dengan panjang 16 byte (128 bit)

// // Fungsi untuk mengenkripsi data
// function encrypt(text, key) {
//   const cipher = crypto.createCipheriv("aes-128-cbc", key, Buffer.alloc(16, 0));
//   let encrypted = cipher.update(text, "utf8", "hex");
//   encrypted += cipher.final("hex");
//   return encrypted;
// }

// // Fungsi untuk mendekripsi data
// function decrypt(encrypted, key) {
//   const decipher = crypto.createDecipheriv(
//     "aes-128-cbc",
//     key,
//     Buffer.alloc(16, 0)
//   );
//   let decrypted = decipher.update(encrypted, "hex", "utf8");
//   decrypted += decipher.final("utf8");
//   return decrypted;
// }

// // Contoh penggunaan

// const encryptionKey = "6526e63982695f2a"; // Anda bisa menggunakan kunci acak yang dibuat
// const id = "6526e63982695f2aa06576c6";
// const nama = "Rafi Dimas Ariyanto";
// const plaintext = id.concat(nama);
// const encryptedText = encrypt(plaintext, encryptionKey);
// const decryptedText = decrypt(encryptedText, encryptionKey);
// const hasil = decryptedText.slice(0, 24);

// console.log("Plaintext:", plaintext);
// console.log("Encrypted:", encryptedText);
// console.log("Decrypted:", decryptedText);
// console.log("Decrypted:", hasil);

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Objek untuk menyimpan data porter dan pesanan
const porterData = {
  gunungA: [
    {
      nama: "Porter A1",
      ketersediaan: true,
      waktuMulai: "2023-11-17T09:00:00",
      waktuSelesai: "2023-11-17T12:00:00",
    },
    {
      nama: "Porter A2",
      ketersediaan: true,
      waktuMulai: "2023-11-17T14:00:00",
      waktuSelesai: "2023-11-17T17:00:00",
    },
  ],
  gunungB: [
    {
      nama: "Porter B1",
      ketersediaan: true,
      waktuMulai: "2023-11-17T10:00:00",
      waktuSelesai: "2023-11-17T14:00:00",
    },
    {
      nama: "Porter B2",
      ketersediaan: true,
      waktuMulai: "2023-11-17T12:00:00",
      waktuSelesai: "2023-11-17T15:00:00",
    },
  ],
};

const pesananData = {};

// Middleware untuk parsing body dari request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint untuk membuat pesanan
app.post("/pesan-porter", (req, res) => {
  const { kodePemesanan, gunung, waktuMulai, waktuSelesai } = req.body;

  // Cek apakah porter tersedia
  if (!isPorterAvailable(gunung, waktuMulai, waktuSelesai)) {
    return res
      .status(400)
      .json({ message: "Porter tidak tersedia pada waktu tersebut." });
  }

  // Pesanan valid, tambahkan ke objek data
  addOrder(kodePemesanan, gunung, waktuMulai, waktuSelesai);
  markPorterUnavailable(gunung, waktuMulai, waktuSelesai);

  res.json({ message: "Pesanan berhasil dibuat." });
});

// Fungsi untuk mengecek ketersediaan porter
// Fungsi untuk mengecek ketersediaan waktu
function isTimeAvailable(gunung, waktuMulai, waktuSelesai) {
  if (!pesananData[gunung]) {
    return true; // Jika gunung belum terdaftar, anggap waktu tersedia
  }

  const pesanans = pesananData[gunung];

  for (const pesanan of pesanans) {
    const pesananStartTime = new Date(pesanan.waktuMulai);
    const pesananEndTime = new Date(pesanan.waktuSelesai);

    const requestedStartTime = new Date(waktuMulai);
    const requestedEndTime = new Date(waktuSelesai);

    // Cek tumpang tindih waktu
    if (
      (requestedStartTime >= pesananStartTime &&
        requestedStartTime < pesananEndTime) ||
      (requestedEndTime > pesananStartTime &&
        requestedEndTime <= pesananEndTime) ||
      (requestedStartTime <= pesananStartTime &&
        requestedEndTime >= pesananEndTime)
    ) {
      return false; // Tersedia jika tidak ada tumpang tindih
    }
  }

  return true;
}

// Fungsi untuk mengecek ketersediaan porter
function isPorterAvailable(gunung, waktuMulai, waktuSelesai) {
  if (!porterData[gunung]) {
    return false; // Jika gunung belum terdaftar, anggap porter tidak tersedia
  }

  const porters = porterData[gunung];

  for (const porter of porters) {
    if (
      porter.ketersediaan &&
      isTimeAvailable(gunung, waktuMulai, waktuSelesai)
    ) {
      return true;
    }
  }

  return false;
}

// Fungsi untuk menambahkan pesanan ke objek data
function addOrder(kodePemesanan, gunung, waktuMulai, waktuSelesai) {
  if (!pesananData[gunung]) {
    pesananData[gunung] = [];
  }

  pesananData[gunung].push({
    kodePemesanan,
    waktuMulai,
    waktuSelesai,
  });
}

// Fungsi untuk menandai porter sebagai tidak tersedia setelah pesanan
function markPorterUnavailable(gunung, waktuMulai, waktuSelesai) {
  const porters = porterData[gunung];

  for (const porter of porters) {
    if (porter.ketersediaan) {
      const porterStartTime = new Date(porter.waktuMulai);
      const porterEndTime = new Date(porter.waktuSelesai);

      const requestedStartTime = new Date(waktuMulai);
      const requestedEndTime = new Date(waktuSelesai);

      // Temukan porter yang sesuai dan tandai sebagai tidak tersedia
      if (
        requestedStartTime.getTime() === porterStartTime.getTime() &&
        requestedEndTime.getTime() === porterEndTime.getTime()
      ) {
        porter.ketersediaan = false;
        break;
      }
    }
  }
}

// Jalankan server pada port tertentu
app.listen(port, () => {
  console.log(`Server berjalan pada http://localhost:${port}`);
});
