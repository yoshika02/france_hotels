export async function POST(req) {
  const { hotelId, finalPrice } = await req.json();

  console.log("Payment Received For Hotel:", hotelId, "Amount:", finalPrice);

  // pretend payment success (later we integrate Razorpay / Stripe)
  return Response.json({ success: true });
}
