"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import hotels from "../data/data.json";

// Hotel images (kept exactly same)
const hotelImages = {
  1: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80",
  2: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80",
  3: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=900&q=80",
  4: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=900&q=80",
  5: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
  6: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=900&q=80",
  7: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80",
  8: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=900&q=80",
  9: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=900&q=80",
  10: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80",
  11: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=900&q=80",
  12: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=900&q=80",
  13: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=900&q=80",
  14: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=900&q=80",
  15: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80",
  16: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80",
  22: "https://images.unsplash.com/photo-1590490359864-7decc3e95f39?auto=format&fit=crop&w=900&q=80",
  18: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
  17: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
  20: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
  19: "https://images.unsplash.com/photo-1535827841776-24afc1e255ac?auto=format&fit=crop&w=900&q=80"
};

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [priceLimit, setPriceLimit] = useState(600);

  // ✅ Check logged in user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  // ✅ Fetch profile info when logged in
  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
      .then(({ data }) => setProfile(data));
  }, [user]);

  // Build unique cities dropdown
  const cities = Array.from(new Set(hotels.map((h) => h.location)));
  const uniqueCities = ["All", ...cities];

  const priceLimitNumber = Number(priceLimit);

  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch =
      hotel.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCity = selectedCity === "All" || hotel.location === selectedCity;
    const matchesPrice = hotel.price <= priceLimitNumber;

    return matchesSearch && matchesCity && matchesPrice;
  });

   // ✅ Handle booking + save to Supabase + send confirmation email
  async function handleBook(hotel) {
    if (!user) {
      alert("Please login to book a hotel!");
      return;
    }

    const { error } = await supabase.from("bookings").insert([
      {
        user_id: user.id,
        hotel_id: hotel.id,
        hotel_name: hotel.name,
        price: hotel.price,
      },
    ]);

    if (error) {
      alert("Error saving booking!");
      console.error(error);
    } else {
      alert(`Booking confirmed! A confirmation has been sent to ${user.email}`);
      await fetch("/api/sendConfirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          hotel: hotel.name,
          price: hotel.price,
        }),
      });
    }
  }

    // ✅ Logout function
  async function logout() {
    await supabase.auth.signOut();
    location.reload();
  }
  
  return (
    <>
      {/* ✅ NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-md rounded-2xl mb-8">
        <h1 className="text-2xl font-bold text-indigo-600 drop-shadow-sm">
          ✨ France Holidays
        </h1>

        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-700">{user.email}</span>
            <a href="/profile" className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600">
              My Profile
            </a>
            <button
              onClick={() => supabase.auth.signOut().then(() => location.reload())}
              className="px-4 py-2 bg-red-400 text-white rounded-xl hover:bg-red-500"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => supabase.auth.signInWithOAuth({ provider: "google" })}
            className="px-5 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 shadow-sm"
          >
            Login with Google
          </button>
        )}
      </nav>

      {/* ✅ MAIN CONTENT */}
      <main className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-10">
        <h1 className="text-4xl font-extrabold text-center text-indigo-600 mb-10 drop-shadow-sm">
          🌸 France Holidays – Hotel Booking
        </h1>

        {/* FILTERS */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-10 items-center">

          <input
            type="text"
            placeholder="Search hotels or location..."
            className="border border-gray-300 rounded-2xl px-5 py-3 w-80 bg-white focus:ring-2 focus:ring-indigo-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="border border-gray-300 rounded-2xl px-4 py-3 w-72 bg-white focus:ring-2 focus:ring-pink-300"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            {uniqueCities.map((city, index) => (
              <option key={index} value={city}>{city}</option>
            ))}
          </select>

          <div className="flex flex-col items-center">
            <span className="text-indigo-700 font-medium mb-1">Max Price: €{priceLimitNumber}</span>
            <input
              type="range"
              min="50"
              max="600"
              step="10"
              className="w-60 accent-pink-500"
              value={priceLimit}
              onChange={(e) => setPriceLimit(e.target.value)}
            />
          </div>
        </div>

        {/* HOTEL LIST */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredHotels.map((hotel) => (
            <div key={hotel.id} className="bg-white rounded-3xl shadow-lg hover:-translate-y-2 transition overflow-hidden">
              <img src={hotelImages[hotel.id]} className="w-full h-48 object-cover" />
              <div className="p-5">
                <h2 className="text-xl font-semibold text-indigo-700">{hotel.name}</h2>
                <p className="text-gray-600">{hotel.location}</p>
                <p className="text-pink-600 font-medium mt-2">€{hotel.price} / night</p>
                <p className="text-yellow-500">⭐ {hotel.rating}</p>
                <button
                  onClick={() => window.location.href = `/book/${hotel.id}`}
                  className="mt-4 w-full py-2.5 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-xl hover:opacity-90"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

      </main>
    </>
  );
}
