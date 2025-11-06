"use client";

import { useState } from "react";

export default function PaymentPage() {
  const [method, setMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");

  const handlePayment = (e) => {
    e.preventDefault();
    window.location.href = "/success"; // Goes to animation success page
  };

  return (
    <main className="min-h-screen p-10 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex justify-center items-center">
      <div className="bg-white shadow-xl rounded-3xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          💳 Payment Page
        </h1>

        {/* Payment Method Tabs */}
        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={() => setMethod("card")}
            className={`px-4 py-2 rounded-xl ${method === "card" ? "bg-gradient-to-r from-indigo-500  to-pink-500 text-white" : "bg-gray-200"}`}
          >
            Card
          </button>
          <button
            onClick={() => setMethod("upi")}
            className={`px-4 py-2 rounded-xl ${method === "upi" ? "bg-gradient-to-r from-indigo-500  to-pink-500 text-white" : "bg-gray-200"}`}
          >
            UPI
          </button>
        </div>

        {/* Card Method */}
        {method === "card" && (
          <form onSubmit={handlePayment} className="space-y-4">
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-xl"
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full py-3 mt-6 bg-gradient-to-r from-indigo-500 to-pink-500 text-white text-lg rounded-xl shadow-md hover:opacity-90 transition"
            >
              Pay €299
            </button>
          </form>
        )}

        {/* UPI Method */}
        {method === "upi" && (
          <div className="text-center space-y-4">
            <p className="text-gray-600">Scan to Pay</p>
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay"
              className="mx-auto rounded-xl"
            />
            <button
              onClick={handlePayment}
              className="w-full py-3 mt-6 bg-gradient-to-r from-indigo-500 to-pink-500 text-white text-lg rounded-xl shadow-md hover:opacity-90 transition"
            >
              I’ve Paid ✅
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
