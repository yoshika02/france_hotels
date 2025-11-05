"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function ProfilePage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    async function fetchBookings() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setBookings(data || []);
    }

    fetchBookings();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-10">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-3xl p-8">
        <h1 className="text-3xl font-bold text-indigo-600 text-center mb-8">
          🧾 My Booking History
        </h1>

        {bookings.length === 0 ? (
          <p className="text-center text-gray-500">No bookings found.</p>
        ) : (
          <ul className="space-y-5">
            {bookings.map((b) => (
              <li
                key={b.id}
                className="border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
              >
                <p className="text-xl font-semibold text-indigo-600">{b.hotel_name}</p>
                <p className="text-gray-600">Check-in: {b.checkin || "Not provided"}</p>
                <p className="text-gray-600">Check-out: {b.checkout || "Not provided"}</p>
                <p className="text-pink-600 font-medium mt-2">€{b.price} total</p>
                <p className="text-sm text-gray-400 mt-2">Booked on {new Date(b.created_at).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
