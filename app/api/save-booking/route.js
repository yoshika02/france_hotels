// app/api/save-booking/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // 1. Get the booking data from the front-end
    const bookingDetails = await request.json();
    
    // 2. PASTE YOUR GOOGLE SCRIPT URL HERE
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwRH99ubaIzTrBdyYe_ootZOdOLhz3Cj5fKUfyi3if9nCvoy4fRJBbtd-ImVJfNE3f4/execc";

    // 3. Send the data to Google Sheets from the server
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingDetails),
    });

    if (!response.ok) {
      // If Google's response is not a 2xx, throw an error
      const errorText = await response.text();
      throw new Error(`Google Script failed: ${response.status} ${errorText}`);
    }

    // 4. Send a success response back to the front-end
    return NextResponse.json({ message: "Booking saved successfully" }, { status: 200 });

  } catch (error) {
    // 5. Send an error response back to the front-end
    console.error("API Route Error:", error.message);
    return NextResponse.json({ message: "Error saving booking", error: error.message }, { status: 500 });
  }
}