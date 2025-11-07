// app/api/save-booking/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const bookingDetails = await request.json();
    console.log("🟢 Received booking data:", bookingDetails);

    // ✅ Normalize field names to handle both camelCase & snake_case
    const normalized = {
      booking_id: bookingDetails.booking_id || bookingDetails.bookingId,
      hotel_id: bookingDetails.hotel_id || bookingDetails.hotelId,
      hotel_name: bookingDetails.hotel_name || bookingDetails.hotelName,
      location: bookingDetails.location || "Not provided",
      name: bookingDetails.name,
      checkin: bookingDetails.checkin,
      checkout: bookingDetails.checkout,
      guests: bookingDetails.guests || 1,
      price: bookingDetails.price,
      date: bookingDetails.date || new Date().toLocaleString(),
    };

    console.log("📦 Normalized booking data:", normalized);

    // ✅ Validate required fields
    const requiredFields = [
      "booking_id",
      "hotel_id",
      "hotel_name",
      "name",
      "checkin",
      "checkout",
      "guests",
      "price",
      "date",
    ];

    const missing = requiredFields.filter((key) => !normalized[key]);
    if (missing.length > 0) {
      console.error("❌ Missing required fields:", missing);
      return NextResponse.json(
        { message: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    // ✅ Correct Google Apps Script endpoint (no double c)
    const GOOGLE_SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbwRH99ubaIzTrBdyYe_ootZOdOLhz3Cj5fKUfyi3if9nCvoy4fRJBbtd-ImVJfNE3f4/exec";

    // ✅ Send data to Google Sheets via Apps Script
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(normalized),
    });

    if (!response.ok) {
      throw new Error("❌ Failed to save to Google Sheets");
    }

    console.log("✅ Booking saved successfully to Google Sheets!");
    return NextResponse.json(
      { message: "Booking saved successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ API Route Error:", error);
    return NextResponse.json(
      { message: "Error saving booking", error: error.message },
      { status: 500 }
    );
  }
}
