import Razorpay from "razorpay";

export async function POST(req) {
  try {
    const { amount } = await req.json();

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: "receipt_" + Math.random(),
    };

    const order = await razorpay.orders.create(options);
    return Response.json({ success: true, order });
  } catch (err) {
    console.log(err);
    return Response.json({ success: false, error: err.message });
  }
}
