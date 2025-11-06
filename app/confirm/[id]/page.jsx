"use client";
import { useEffect, useState } from "react";

export default function ConfirmPage({ params }) {
  const { id } = params;
  const [hotel, setHotel] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true); // Wait until client-side hydration finishes
  }, []);

  useEffect(() => {
    const savedHotel = localStorage.getItem("selectedHotel");
    if (savedHotel) {
      const parsed = JSON.parse(savedHotel);
      if (parsed.id === Number(id)) {
        setHotel(parsed);
      }
    }
  }, [id]);

  if (!hydrated) {
    // Prevent SSR mismatch by not rendering inputs until client is ready
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <h2 className="text-indigo-600 font-semibold text-xl">
          Initializing booking page…
        </h2>
      </main>
    );
  }

  if (!hotel)
    return (
      <h1 className="text-center p-10 text-gray-600">Loading booking...</h1>
    );

  return (
    <main className="min-h-screen flex justify-center items-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-6">
      <div className="bg-white shadow-xl rounded-3xl p-10 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-indigo-600 mb-4">
          🧳 Confirm Booking
        </h1>

        <p className="text-lg font-medium text-gray-700 mb-2">
          <strong>Hotel:</strong> {hotel.name}
        </p>

        <p className="text-gray-700 mb-2">
          <strong>Location:</strong> {hotel.location}
        </p>

        <p className="text-gray-700 mb-4">
          <strong>Price:</strong> €{hotel.price}
        </p>

        <p className="text-gray-500 text-sm mb-6">
          Review your booking before proceeding to payment.
        </p>

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
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-xl font-medium shadow hover:opacity-90 transition"
          >
            Proceed to Payment 💳
          </button>
        </div>

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
