"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function ConfirmPage({ params }) {
  const { id } = params;
  const [hotel, setHotel] = useState(null);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Please login first!");
        window.location.href = "/";
        return;
      }

      // Fetch booking details OR selected hotel stored in localstorage earlier
      const selected = localStorage.getItem("selectedHotel");

      if (selected) {
        const info = JSON.parse(selected);
        if (info.id === Number(id)) {
          setHotel(info);
          return;
        }
      }

      // If not found locally, fallback -> fetch from DB
      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("hotel_id", id)
        .maybeSingle();

      setHotel(data);
    }
    load();
  }, [id]);

  if (!hotel) return <h1 className="text-center p-10">Loading booking details...</h1>;

  return (
    <main className="min-h-screen flex justify-center items-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-6">
      <div className="bg-white shadow-xl rounded-3xl p-10 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-indigo-600 mb-4">
          🧳 Confirm Your Booking
        </h1>

        <p className="text-xl font-semibold text-gray-700 mb-1">{hotel.name}</p>
        <p className="text-gray-500 mb-2">{hotel.location}</p>

        <p className="text-pink-600 font-bold mb-6">€{hotel.price} / night</p>

        <p className="text-gray-500 mb-4">
          Please confirm your booking before proceeding to payment.
        </p>

        {/* ✅ CENTER BUTTON */}
        <div className="flex justify-center mt-6">
       <div className="flex justify-center mt-6">
  <button
  onClick={() => {
    localStorage.setItem(
      "selectedHotel",
      JSON.stringify({
        id: hotel.id,
        name: hotel.name,
        location: hotel.location,
        price: hotel.price,
      })
    );
    window.location.href = `/pay/${hotel.id}`;
  }}
  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-xl font-medium shadow hover:opacity-90"
>
  Proceed to Payment 💳
</button>


</div>

        </div>

        {/* Back Button */}
        <a
          href="/"
          className="block mt-6 text-gray-600 hover:text-indigo-600 transition"
        >
          ← Cancel & Return Home
        </a>
      </div>
    </main>
  );
}
