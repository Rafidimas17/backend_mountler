const midtransClient = require("midtrans-client");
const Booking = require("../../models/Booking");
const Porter = require("../../models/Porter");
async function handleTransactionNotification(notificationJson) {
  let apiClient = new midtransClient.Snap({
    isProduction: false,
    serverKey: "SB-Mid-server-HOAowzEVHWBWylIMPkmfROAQ",
    clientKey: "SB-Mid-client-AidiYHDGM1ntrvqo",
  });
  return apiClient.transaction
    .notification(notificationJson)
    .then((statusResponse) => {
      let transactionStatus = statusResponse.transaction_status;
      let fraudStatus = statusResponse.fraud_status;

      if (transactionStatus == "capture") {
        // capture only applies to card transaction, which you need to check for the fraudStatus
        if (fraudStatus == "challenge") {
          return "challenge";
          // TODO set transaction status on your databaase to 'challenge'
        } else if (fraudStatus == "accept") {
          return "paid";
        }
      } else if (transactionStatus == "settlement") {
        return "settlement";
      } else if (transactionStatus == "deny") {
        return "deny";
        // TODO you can ignore 'deny', because most of the time it allows payment retries
        // and later can become success
      } else if (
        transactionStatus == "cancel" ||
        transactionStatus == "expire"
      ) {
        return "failure";
        // TODO set transaction status on your databaase to 'failure'
      } else if (transactionStatus == "pending") {
        return "pending";
        // TODO set transaction status on your databaase to 'pending' / waiting payment
      } else {
        return "capture";
      }
    });
}

async function generateQRCode(text, fileName, condition, invoice) {
  try {
    // Buat QR code dari teks dengan versi 5
    const qrData = await qrcode.toDataURL(text, { version: 6 });
    const stringRandom = crypto
      .randomBytes(Math.ceil(10 / 2))
      .toString("hex")
      .slice(0, 10);
    // Simpan QR code di dalam folder "public/images/qr-code" dalam format PNG
    const imagePath = path.join(
      __dirname,
      "../../public/images/qr-code",
      `${fileName}_${condition}_${invoice}_${stringRandom}.png`
    );

    // Decode base64 data dan simpan ke file
    const data = qrData.replace(/^data:image\/png;base64,/, "");
    await fs.writeFile(imagePath, data, "base64");
    const relativePath = `/images/qr-code/${path.basename(imagePath)}`;
    return relativePath;
  } catch (error) {
    console.log(error);
  }
}
module.exports = {
  getNotification: async (req, res) => {
    const {
      currency,
      fraud_status,
      gross_amount,
      order_id,
      payment_type,
      status_code,
      status_message,
      transaction_id,
      transaction_status,
      transaction_time,
      bank,
      va_number,
    } = req.body;

    try {
      if (order_id.length < 10) {
        const orderId = await Booking.findOne({ invoice: order_id });

        if (orderId) {
          let notificationJson = {
            currency,
            fraud_status,
            gross_amount,
            order_id,
            payment_type,
            status_code,
            status_message,
            transaction_id,
            transaction_status,
            transaction_time,
            va_numbers: [{ bank, va_number }],
          };

          const paymentStatus = await handleTransactionNotification(
            notificationJson
          );

          if (paymentStatus === "paid" || paymentStatus === "settlement") {
            orderId.payments.payment_status = "paid";
            orderId.payments.midtrans_url = null;
            orderId.payments.status = "Lunas";
            await orderId.save();
          } else if (paymentStatus === "pending") {
            orderId.payments.payment_status = "pending";
            await orderId.save();
          } else if (paymentStatus === "failure") {
            orderId.payments.payment_status = "failure";
            orderId.payments.midtrans_url = null;
            orderId.payments.status = "Cancel";
            await orderId.save();
          }
        }
      } else if (order_id.length > 10) {
        const decodedBuffer = Buffer.from(order_id, "base64");
        const decodedString = decodedBuffer.toString("utf-8");
        const [invoice, id] = [
          decodedString.slice(0, 8),
          decodedString.slice(8),
        ];

        const findPorter = await Porter.findOne({ _id: id });

        if (findPorter && findPorter.bookingId.includes(invoice)) {
          let notificationJson = {
            currency,
            fraud_status,
            gross_amount,
            order_id,
            payment_type,
            status_code,
            status_message,
            transaction_id,
            transaction_status,
            transaction_time,
            va_numbers: [{ bank, va_number }],
          };

          const paymentStatusPorter = await handleTransactionNotification(
            notificationJson
          );

          if (
            paymentStatusPorter === "paid" ||
            paymentStatusPorter === "settlement"
          ) {
            findPorter.payments.payment_url = null;
            findPorter.payments.status = "paid";
            await findPorter.save();
            const findBooking = await Booking.findOne({ invoice: invoice });
            findBooking.porterId.push(id);
            await findBooking.save();
          } else if (paymentStatusPorter === "pending") {
            findPorter.payments.status = "pending";
            await findPorter.save();
          } else if (paymentStatusPorter === "failure") {
            findPorter.payments.payment_url = null;
            findPorter.payments.status = "failure";
            await findPorter.save();
          }
        }
      }
      res.status(200).json({
        success: true,
        message: "Notification processed successfully.",
      });
    } catch (error) {
      // console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },
};
