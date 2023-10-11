const parts = token.split(".");
const payloadBase64 = parts[1];
const payloadJSON = JSON.parse(
  Buffer.from(payloadBase64, "base64").toString("utf8")
);

const id = payloadJSON.id;
