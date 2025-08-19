import axios from 'axios';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const {
    transactionId,
    productId,
    buyerName,
    buyerEmail,
    buyerPhone,
    downloadLink,
    amount
  } = req.body;

  const merchantId = process.env.PHONEPE_MERCHANT_ID;
  const merchantSecret = process.env.PHONEPE_MERCHANT_SECRET;

  const path = `/pg/v1/status/${merchantId}/${transactionId}`;
  const xVerify = crypto
    .createHmac('sha256', merchantSecret)
    .update(path + merchantSecret)
    .digest('hex');

  try {
    const response = await axios.get(
      `https://api-preprod.phonepe.com/apis/pg-sandbox${path}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-MERCHANT-ID': merchantId,
          'X-VERIFY': `${xVerify}###1`,
        },
      }
    );

    if (response.data.data?.state === 'COMPLETED') {
      await supabase.from('digital_orders').insert({
        product_id: productId,
        buyer_name: buyerName,
        buyer_email: buyerEmail,
        buyer_phone: buyerPhone,
        amount_paid: amount,
        payment_status: 'success',
        order_status: 'confirmed',
        download_link: downloadLink,
        transaction_id: transactionId,
        purchase_date: new Date().toISOString(),
      });

      return res.status(200).json({ success: true });
    }

    res.status(400).json({ success: false, message: 'Payment not completed' });
  } catch (err) {
    console.error('Verify error:', err.response?.data || err.message);
    res.status(500).json({ success: false });
  }
}
