const axios = require("axios");

let cachedToken = null;
let cachedExpiry = 0;

async function getPhonePeAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedExpiry > now) return cachedToken;

  const url =
    process.env.NODE_ENV === "production"
      ? "https://api.phonepe.com/apis/identity-manager/v1/oauth/token"
      : "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token";

  const payload = new URLSearchParams({
    client_id: process.env.PHONEPE_MERCHANT_ID,
    client_secret: process.env.PHONEPE_MERCHANT_SECRET,
    client_version: "1",
    grant_type: "client_credentials"
  });

  const { data } = await axios.post(url, payload.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  });

  cachedToken = data.access_token;
  cachedExpiry = data.expires_at;
  return cachedToken;
}

module.exports = { getPhonePeAccessToken };
