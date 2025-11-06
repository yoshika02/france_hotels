"use client";
import { useEffect } from "react";

export default function SuccessPage() {
  useEffect(() => {
    const details = JSON.parse(localStorage.getItem("bookingDetails"));
    if (details) {
      fetch("/api/sendconfirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details),
      });
    }
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-green-50 text-center p-10">
      <div className="text-6xl">✅</div>
      <h1 className="text-3xl font-bold text-green-600 mt-4">
        Payment Successful!
      </h1>
      <p className="mt-2 text-gray-600">Congratulations your booking have been confirmed!</p>

      <a href="/" className="mt-6 text-blue-600 underline">
        Return Home
      </a>
    </main>
  );
}
