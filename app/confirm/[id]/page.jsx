"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ConfirmPage({ params }) {
  const { id } = params;
  const router = useRouter();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState(1);

  // 🧭 Load hotel data
  useEffect(() => {
    async function loadHotel() {
      if (!id) return;

      const saved = localStorage.getItem("selectedHotel");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.id.toString() === id) {
          setHotel(parsed);
          setLoading(false);
          return;
        }
      }

      // If not found in localStorage → fetch from Supabase
      const { data, error } = await supabase
        .from("hotels")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error || !data) {
        console.error("Error fetching hotel:", error);
        alert("Hotel not found, redirecting home.");
        window.location.href = "/";
      } else {
        setHotel(data);
        localStorage.setItem("selectedHotel", JSON.stringify(data));
      }
      setLoading(false);
    }

    loadHotel();
  }, [id]);

  // 🧾 Handle confirm
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hotel) {
      alert("Error: Hotel data not loaded.");
      return;
    }

    // 🧠 Prepare booking data
    const bookingDetails = {
      name,
      hotel: hotel.name,
      location: hotel.location,
      checkin,
      checkout,
      guests,
      price: hotel.price,
    };

    try {
      // ✅ Send booking to Google Sheets (replace URL with yours)
      await fetch("https://script.google.com/macros/s/AKfycbxB6BUWqoLqmnGsJdBGgSogcxM20Ce9r0_v5NO1oLgClfArDYewAuRZaDQQPSSb5okS/exec", {
        method: "POST",
        mode: "no-cors", // required for Apps Script
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingDetails),
      });

      // Save booking for next page
      localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));

      alert("✅ Booking saved successfully!");
      router.push(`/pay/${hotel.id}`);
    } catch (err) {
      console.error("❌ Error saving to Google Sheets:", err);
      alert("Could not save booking data.");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <h1 className="text-2xl text-indigo-600 font-semibold">
          Loading Hotel Details...
        </h1>
      </main>
    );
  }

  if (!hotel) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-red-50">
        <h1 className="text-xl text-red-600 font-semibold">
          ❌ Hotel not found
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex justify-center items-center p-10">
      <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-8 max-w-lg w-full border border-pink-100">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          🧳 Confirm Your Booking
        </h1>

        {/* 🏨 Hotel Info */}
        <div className="text-center mb-6">
          <img
            src={hotel.image_url || "https://via.placeholder.com/400x250"}
            alt={hotel.name}
            className="rounded-2xl w-full h-48 object-cover shadow-md mb-3"
          />
          <p className="text-xl font-semibold text-indigo-700">{hotel.name}</p>
          <p className="text-gray-600">{hotel.location}</p>
          <p className="text-pink-600 font-medium mt-1">
            €{hotel.price} / night
          </p>
        </div>

        {/* 📝 Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              min={1}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            />
          </div>

          {/* 🪄 Continue */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white text-lg rounded-xl font-medium shadow-md hover:opacity-90 transition"
          >
            Continue to Payment 💳
          </button>
        </form>

        {/* 🏠 Back */}
        <div className="text-center mt-5">
          <a
            href="/"
            className="text-gray-600 hover:text-indigo-600 hover:underline transition"
          >
            ← Cancel & Return Home
          </a>
        </div>
      </div>
    </main>
  );
}
