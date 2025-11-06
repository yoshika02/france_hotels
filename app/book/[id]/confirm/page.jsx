"use client";

import { useState } from "react";

export default function ConfirmPage() {
  const [name, setName] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save booking details to localStorage (to use on success page)
    const hotel = JSON.parse(localStorage.getItem("selectedHotel"));

localStorage.setItem(
  "bookingDetails",
  JSON.stringify({ name, checkin, checkout, guests, hotel })
);

window.location.href = `/pay/${hotel.id}`
;

  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-10 flex justify-center">
      <div className="bg-white shadow-xl rounded-3xl p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          🧳 Confirm Your Booking
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Check-in Date
            </label>
            <input
              type="date"
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={checkin}
              onChange={(e) => setCheckin(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Check-out Date
            </label>
            <input
              type="date"
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={checkout}
              onChange={(e) => setCheckout(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Number of Guests
            </label>
            <input
              type="number"
              required
              min={1}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white text-lg rounded-xl font-medium shadow-md hover:opacity-90 transition"
          >
            ✅ Confirm Booking
          </button>
        </form>

        <a
          href="/"
          className="block text-center mt-4 text-gray-600 hover:underline"
        >
          ← Cancel & Return Home
        </a>
      </div>
    </main>
  );
}
