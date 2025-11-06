"use client";

import { useEffect, useState } from "react";
// Make sure to import supabase if you need to fetch
import { supabase } from "../../../lib/supabaseClient"; 

// 1. Correctly accept { params }
export default function ConfirmPage({ params }) {
  const { id } = params; // Get ID from the URL

  // 2. Add state for the hotel itself
  const [hotel, setHotel] = useState(null);

  const [name, setName] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState(1);

  // 3. Load hotel data on page load
  useEffect(() => {
    async function loadHotel() {
      if (!id) return; // Wait for the id

      // Try localStorage first
      const saved = localStorage.getItem("selectedHotel");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Check if the saved hotel matches the ID in the URL
        if (parsed.id.toString() === id) {
          setHotel(parsed);
          return;
        }
      }

      // If not in localStorage (or it's the wrong hotel), fetch from DB
      // This makes the page work on refresh
      console.log("Fetching hotel from DB as it's not in localStorage...");
      const { data, error } = await supabase
        .from("hotels") // Assuming table name is 'hotels'
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching hotel:", error);
        alert("Error: Could not load hotel data.");
        window.location.href = "/"; // Go home if hotel can't be found
      } else {
        setHotel(data);
        // Also save it to localStorage for the *next* step (pay page)
        localStorage.setItem("selectedHotel", JSON.stringify(data));
      }
    }

    loadHotel();
  }, [id]); // Dependency array ensures this runs when 'id' is available

  const handleSubmit = (e) => {
    e.preventDefault();

    // 4. Check if hotel loaded before submitting
    if (!hotel) {
      alert("Error: Hotel data is still loading or could not be found.");
      return;
    }

    // Save booking details to localStorage (to use on success page)
    localStorage.setItem(
      "bookingDetails",
      JSON.stringify({ name, checkin, checkout, guests, hotel })
    );

    // 5. This will now work, as 'hotel' is from state
    window.location.href = `/pay/${hotel.id}`;
  };

  // Show loading state while hotel is fetched
  if (!hotel) {
    return (
      <h1 className="text-center p-10 text-2xl font-semibold">
        Loading Hotel Details...
      </h1>
    );
  }

  // --- Render the form (your JSX, unchanged) ---
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-10 flex justify-center">
      <div className="bg-white shadow-xl rounded-3xl p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          🧳 Confirm Your Booking
        </h1>
        
        {/* You can show hotel details here too */}
        <div className="text-center mb-4 border-b pb-4">
            <p className="text-xl font-bold text-gray-800">{hotel.name}</p>
            <p className="text-gray-500">{hotel.location}</p>
            <p className="text-lg font-semibold text-pink-600">€{hotel.price} / night</p>
        </div>

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