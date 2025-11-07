"use client";

import { use } from "react";
import { useState } from "react";
import hotels from "../../../../data/data.json";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabaseClient"; // ✅ IMPORT SUPABASE

export default function ConfirmBookingPage(props) {
  const params = use(props.params);
  const router = useRouter();

  const hotelId = Number(params.id);
  const hotel = hotels.find((h) => h.id === hotelId);

  const [form, setForm] = useState({
    name: "",
    checkin: "",
    checkout: "",
    guests: 1,
  });

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!hotel) {
    alert("Hotel not found");
    return;
  }

  // 🆕 Generate full booking data (camelCase + date)
  const bookingDetails = {
    bookingId: `BK-${hotel.location.split(",")[0].substring(0, 3).toUpperCase()}-${Date.now()}`,
    hotelId: hotel.id,
    hotelName: hotel.name,
    location: hotel.location,
    name: form.name,
    checkin: form.checkin,
    checkout: form.checkout,
    guests: form.guests,
    price: hotel.price,
    date: new Date().toLocaleString(),
  };

  console.log("🟢 Sending booking details:", bookingDetails);

  try {
    const res = await fetch("/api/save-booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingDetails),
    });

    const result = await res.json();
    console.log("🧾 Response from API:", result);

    if (!res.ok) throw new Error(result.message || "Server error");

    alert("✅ Booking saved successfully to Google Sheets!");
    localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));
    router.push(`/pay/${hotel.id}`);
  } catch (err) {
    console.error("❌ Booking failed:", err);
    alert("Booking failed: " + err.message);
  }
};


  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex justify-center items-center p-8">
      <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-8 max-w-md w-full border border-pink-100 transition-all hover:shadow-pink-200">
        <h1 className="text-3xl font-extrabold text-center text-indigo-600 mb-4">
          🧳 Confirm Your Booking
        </h1>

        <h2 className="text-lg font-semibold text-center text-pink-600 mb-6">
          {hotel?.name || "Hotel Not Found"}
        </h2>

        {/* 🧾 Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400 outline-none"
              suppressHydrationWarning={true}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Check-in Date
            </label>
            <input
              type="date"
              required
              value={form.checkin}
              onChange={(e) => setForm({ ...form, checkin: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400 outline-none"
              suppressHydrationWarning={true}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Check-out Date
            </label>
            <input
              type="date"
              required
              value={form.checkout}
              onChange={(e) => setForm({ ...form, checkout: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400 outline-none"
              suppressHydrationWarning={true}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Number of Guests
            </label>
            <input
              type="number"
              min="1"
              required
              value={form.guests}
              onChange={(e) => setForm({ ...form, guests: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400 outline-none"
              suppressHydrationWarning={true}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold rounded-xl shadow-md hover:opacity-90 transition"
          >
            ✅ Continue to Payment
          </button>
        </form>

        <div className="text-center mt-5">
          <Link
            href={`/book/${hotelId}`}
            className="inline-block text-gray-600 hover:text-indigo-600 hover:underline transition"
          >
            ← Back to Hotel
          </Link>
        </div>
      </div>
    </main>
  );
}
