import nodemailer from "nodemailer";

export async function POST(req) {
  const { name, checkin, checkout, guests, hotel } = await req.json();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // your gmail
      pass: process.env.EMAIL_PASS, // app password
    },
  });

  await transporter.sendMail({
    from: `"France Holidays" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // send to yourself or user email later
    subject: "Booking Confirmed ✅",
    html: `
  <h2>Booking Confirmed ✅</h2>
  <p><strong>Hotel:</strong> ${paymentInfo.hotelName}</p>
  <p><strong>Location:</strong> ${paymentInfo.location}</p>
  <p><strong>Total Paid:</strong> €${paymentInfo.total}</p>
  ${paymentInfo.discount > 0 ? `<p><strong>Discount Applied:</strong> €${paymentInfo.discount}</p>` : ""}
  <p>Thank you for choosing France Holidays! 🇫🇷</p>
`,

  });

  return Response.json({ success: true });
}
