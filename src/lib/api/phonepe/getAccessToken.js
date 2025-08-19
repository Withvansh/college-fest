// backend/phonepe/getAccessToken.js
import axios from 'axios';

let cachedToken = null;
let expiresAt = 0;

export async function getPhonePeAccessToken() {
  const now = Math.floor(Date.now() / 1000);

  if (cachedToken && now < expiresAt) {
    return cachedToken; // Return cached token if still valid
  }

  const client_id = process.env.PHONEPE_CLIENT_ID;
  const client_secret = process.env.PHONEPE_CLIENT_SECRET;
  const client_version = process.env.PHONEPE_CLIENT_VERSION;

  const formData = new URLSearchParams();
  formData.append('client_id', client_id);
  formData.append('client_secret', client_secret);
  formData.append('client_version', client_version);
  formData.append('grant_type', 'client_credentials');

  const response = await axios.post(
    'https://api.phonepe.com/apis/identity-manager/v1/oauth/token',
    formData.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  const { access_token, expires_at } = response.data;
  cachedToken = access_token;
  expiresAt = expires_at;

  return access_token;
}

