// utils/phonepe/getPhonePeAccessToken.ts
import axios from 'axios';

export async function getPhonePeAccessToken() {
  const url = 'https://api.phonepe.com/apis/identity-manager/v1/oauth/token';

  const params = new URLSearchParams();
  params.append('client_id', process.env.PHONEPE_CLIENT_ID!);
  params.append('client_secret', process.env.PHONEPE_CLIENT_SECRET!);
  params.append('client_version', process.env.PHONEPE_CLIENT_VERSION || '1');
  params.append('grant_type', 'client_credentials');

  const response = await axios.post(url, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const token = response.data?.access_token;
  if (!token) throw new Error('Failed to retrieve PhonePe token');

  return token;
}
