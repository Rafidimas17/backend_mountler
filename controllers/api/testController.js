const midtransClient = require("midtrans-client");
const Booking = require("../../models/Booking");

async function handleTransactionNotification(notificationJson) {
  let apiClient = new midtransClient.Snap({
    isProduction: false,
    serverKey: "SB-Mid-server-HOAowzEVHWBWylIMPkmfROAQ",
    clientKey: "SB-Mid-client-AidiYHDGM1ntrvqo",
  });
  return apiClient.transaction
    .notification(notificationJson)
    .then((statusResponse) => {
      console.log(statusResponse);
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
        // TODO set transaction status on your databaase to 'success'
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
        if (paymentStatus === "paid") {
          orderId.payments.payment_status = "paid";
          orderId.payments.midtrans_url = null;
          await orderId.save();
        } else if (paymentStatus === "pending") {
          orderId.payments.payment_status = "pending";
          await orderId.save();
        } else if (paymentStatus === "failure") {
          orderId.payments.payment_status = "failure";
          orderId.payments.midtrans_url = null;
          await orderId.save();
        }
      }
    } catch (error) {}
  },
};
