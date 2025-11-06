"use client";

import { useEffect, useState } from "react";

// The component correctly receives `{ params }` from the dynamic route
export default function PaymentPage({ params }) {
    const { id } = params; // Get the hotel ID from the URL

    // State for the component
    const [hotel, setHotel] = useState(null); // Will be loaded from API
    const [coupon, setCoupon] = useState("");
    const [discount, setDiscount] = useState(0);
    const [finalAmount, setFinalAmount] = useState(null);
    const [method, setMethod] = useState("card");

    // This useEffect hook fetches data using the `id` from the URL
    useEffect(() => {
        // Only run if the id is available
        if (!id) return;

        async function fetchHotelData() {
            try {
                // *** IMPORTANT ***
                // Replace this with your actual API endpoint
                const response = await fetch(`/api/hotels/${id}`);
                
                if (!response.ok) {
                    throw new Error("Hotel data not found");
                }
                
                const data = await response.json();
                
                setHotel(data);
                setFinalAmount(data.price); // Set initial price

            } catch (error) {
                console.error("Failed to fetch hotel:", error);
                // You could add error handling here, e.g., redirect to 404
            }
        }

        fetchHotelData();
        
    }, [id]); // This effect depends on the `id` from the params

    // Function to apply the coupon
    const applyCoupon = () => {
        if (!hotel) return;

        if (coupon.trim().toUpperCase() === "FRANCE10") {
            const newDiscount = hotel.price * 0.1;
            const discountedAmount = hotel.price * 0.9;
            setDiscount(newDiscount);
            setFinalAmount(discountedAmount);
            alert("✅ Coupon Applied — 10% OFF");
        } else {
            // Reset to original price if coupon is invalid
            setDiscount(0);
            setFinalAmount(hotel.price); 
            alert("❌ Invalid Coupon Code");
        }
    };

    // Function to handle the final payment step
    const payNow = () => {
        // Save payment details (now including the ID)
        localStorage.setItem(
            "paymentDetails",
            JSON.stringify({
                hotelId: id,
                hotel: hotel.name,
                total: finalAmount,
                discount,
                method,
            })
        );
        // Redirect to a success page
        window.location.href = "/success";
    };

    // Loading state while the hotel data is being fetched
    if (!hotel) {
        return (
            <h2 className="text-center p-10 text-purple-700 font-semibold">
                Loading Payment Page for Hotel {id}...
            </h2>
        );
    }

    // Once data is loaded, render the full payment page
    return (
        <main className="min-h-screen flex justify-center items-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-8">
            <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-pink-200">
                <h1 className="text-3xl font-bold text-indigo-600 mb-4">
                    💳 Payment — {hotel.name}
                </h1>

                <p className="text-gray-500 mb-4">{hotel.location}</p>

                <p className="text-lg font-semibold text-pink-600 mb-2">
                    Base Price: €{hotel.price}
                </p>

                <input
                    type="text"
                    placeholder="Apply Coupon (FRANCE10)"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="border rounded-xl px-4 py-2 w-full mb-2 focus:ring-2 focus:ring-pink-400"
                />

                <button
                    onClick={applyCoupon}
                    className="mb-4 bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-2 px-4 rounded-xl w-full shadow hover:opacity-90 transition"
                >
                    🎁 Apply Coupon
                </button>

                {discount > 0 && (
                     <p className="text-sm font-medium text-gray-600 mb-2">
                        Discount Applied: -€{discount.toFixed(2)}
                    </p>
                )}

                <h2 className="text-2xl font-bold text-green-600 mb-4">
                    Final Amount: €{finalAmount.toFixed(2)}
                </h2>

                {/* Method Tabs */}
                <div className="flex justify-center gap-2 mb-4">
                    {["card", "upi", "paypal"].map((m) => (
                        <button
                            key={m}
                            onClick={() => setMethod(m)}
                            className={`px-4 py-2 rounded-xl font-medium ${
                                method === m
                                    ? "bg-indigo-600 text-white"
                                    : "bg-gray-200 text-gray-700"
                            }`}
                        >
                            {m.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Card */}
                {method === "card" && (
                    <button
                        className="w-full py-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-xl hover:opacity-90 shadow-md"
                        onClick={payNow}
                    >
                        💳 Pay €{finalAmount.toFixed(2)}
                    </button>
                )}

                {/* UPI */}
                {method === "upi" && (
                    <div>
                        <img
                            src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay"
                            className="mx-auto mb-3 rounded-xl border"
                            alt="UPI QR Code for payment"
                        />
                        <button
                            onClick={payNow}
                            className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700"
                        >
                            ✅ I’ve Paid via UPI
                        </button>
                    </div>
                )}

                {/* PayPal */}
                {method === "paypal" && (
                    <button
                        onClick={payNow}
                        className="w-full py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600"
                    >
                        🟡 Pay with PayPal
                    </button>
                )}

                <a
                    href="/"
                    className="block mt-4 text-gray-600 hover:text-indigo-600 transition font-medium"
                >
                    ← Cancel & Return Home
                </a>
            </div>
        </main>
    );
}