const midtransClient = require("midtrans-client");
const Booking = require("../../models/Booking");

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
      const orderId = await Booking.findOne({ invoice: order_id });

      if (orderId) {
        let apiClient = new midtransClient.Snap({
          isProduction: false,
          serverKey: "SB-Mid-server-HOAowzEVHWBWylIMPkmfROAQ",
          clientKey: "SB-Mid-client-AidiYHDGM1ntrvqo",
        });
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

        async function handleTransactionNotification(notificationJson) {
          return apiClient.transaction
            .notification(notificationJson)
            .then((statusResponse) => {
              let orderId = statusResponse.order_id;
              let transactionStatus = statusResponse.transaction_status;
              let fraudStatus = statusResponse.fraud_status;

              if (transactionStatus == "capture") {
                if (fraudStatus == "challenge") {
                  return "challenge";
                } else if (
                  fraudStatus == "accept" &&
                  transactionStatus == "capture"
                ) {
                  return "paid", orderId;
                }
              } else if (transactionStatus == "settlement") {
              } else if (transactionStatus == "deny") {
                return "deny";
              } else if (
                transactionStatus == "cancel" ||
                transactionStatus == "expire"
              ) {
                return "failure";
              } else if (transactionStatus == "pending") {
                return "pending";
              }

              // Mengembalikan objek yang berisi informasi status transaksi
            });
        }
        console.log(await handleTransactionNotification(notificationJson));
      }
    } catch (error) {}
  },
};
