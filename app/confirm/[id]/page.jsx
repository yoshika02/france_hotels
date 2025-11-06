"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ConfirmPage({ params }) {
    const router = useRouter();
    const { id } = params;
    const [name, setName] = useState("");
    const [checkin, setCheckin] = useState("");
    const [checkout, setCheckout] = useState("");
    const [guests, setGuests] = useState(1);
    const [hotel, setHotel] = useState(null);
    const [hydrated, setHydrated] = useState(false);

    // ✅ Wait until client is ready before accessing localStorage
    useEffect(() => {
        setHydrated(true);
        const storedHotel = localStorage.getItem("selectedHotel");
        if (storedHotel) {
            const parsed = JSON.parse(storedHotel);
            setHotel(parsed);
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!hotel) {
            alert("⚠️ Hotel details not found. Please go back and select again.");
            return;
        }

        // ✅ Store booking info safely
        localStorage.setItem(
            "bookingDetails",
            JSON.stringify({ name, checkin, checkout, guests, hotel })
        );

        // ✅ Navigate correctly using Next.js router
        router.push(`/pay/${hotel.id}`);
    };

    if (!hydrated)
        return (
            <h1 className="text-center text-purple-600 p-10">Loading booking form…</h1>
        );

    if (!hotel)
        return (
            <main className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
                <div className="bg-white p-8 rounded-3xl shadow-xl text-center">
                    <h2 className="text-xl font-bold text-indigo-600 mb-3">
                        No Hotel Selected
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Please go back and select a hotel to continue.
                    </p>
                    <a
                        href="/"
                        className="px-5 py-2 bg-indigo-500 text-white rounded-xl shadow-md hover:opacity-90"
                    >
                        Go Home
                    </a>
                </div>
            </main>
        );

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
