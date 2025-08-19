export default function handler(req, res) {
  res.status(200).json({
    message: "PhonePe API is working",
    environment: {
      merchant_id: process.env.PHONEPE_MERCHANT_ID ? "✅ Set" : "❌ Missing",
      merchant_secret: process.env.PHONEPE_MERCHANT_SECRET ? "✅ Set" : "❌ Missing",
      supabase_url: process.env.SUPABASE_URL ? "✅ Set" : "❌ Missing",
      supabase_key: process.env.SUPABASE_SERVICE_KEY ? "✅ Set" : "❌ Missing",
    }
  });
}
