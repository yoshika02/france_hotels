import hotels from "../../../data/data.json";
import Link from "next/link";

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
  17: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
  18: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
  19: "https://images.unsplash.com/photo-1535827841776-24afc1e255ac?auto=format&fit=crop&w=900&q=80",
  20: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
  22: "https://images.unsplash.com/photo-1590490359864-7decc3e95f39?auto=format&fit=crop&w=900&q=80"
};

// keeps your existing behavior — Next will pre-generate these dynamic routes
export function generateStaticParams() {
  return hotels.map((hotel) => ({
    id: String(hotel.id),
  }));
}

// custom Loading UI for this route (replaces Next's default)
export function Loading() {
  return (
    <main style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(180deg, #FFF8F4 0%, #FEEBF2 100%)" }}>
      <div style={{
        background: "white",
        padding: 24,
        borderRadius: 16,
        boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
        textAlign: "center",
        width: 300
      }}>
        <div style={{ height: 8, width: "100%", background: "linear-gradient(90deg,#6BA8FF,#FFB6C1)", borderRadius: 8, marginBottom: 14 }} />
        <h3 style={{ margin: 0, fontSize: 18, color: "#5B6B8A" }}>Loading hotel details…</h3>
        <p style={{ marginTop: 8, color: "#9AA3B2" }}>Almost there — fetching the best room options for you.</p>
      </div>
    </main>
  );
}

export default async function BookingPage(props) {
  // unwrap params (safe for Next.js 16+)
  const { id } = await props.params;
  const hotelId = Number(id);
  const hotel = hotels.find((item) => item.id === hotelId);

  if (!hotel) {
    return (
      <main style={{ padding: 40, minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 28, marginBottom: 6 }}>Hotel Not Found</h1>
          <p style={{ color: "#666" }}>ID received: {id}</p>
          <Link href="/" style={{ display: "inline-block", marginTop: 18, padding: "10px 16px", background: "#6BA8FF", color: "white", borderRadius: 8, textDecoration: "none" }}>
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: "linear-gradient(180deg,#FFF8F4 0%, #F2F8FF 100%)", minHeight: "100vh", padding: 40, display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
      <div style={{
        width: "100%",
        maxWidth: 980,
        background: "white",
        borderRadius: 20,
        boxShadow: "0 10px 40px rgba(20,30,60,0.08)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
      }}>
        {/* hero image */}
       <img
  src={hotelImages[hotel.id] || "/placeholder-hotel.jpg"}
  alt={hotel.name}
  style={{ width: "100%", height: 420, objectFit: "cover" }}
/>

        {/* content */}
        <div style={{ padding: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20 }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ margin: 0, fontSize: 32, color: "#2B3B55" }}>{hotel.name}</h1>
              <p style={{ marginTop: 8, color: "#6B7280", fontSize: 16 }}>{hotel.location}</p>

              <div style={{ marginTop: 18, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ background: "#FFF0F0", color: "#FF6B6B", padding: "6px 10px", borderRadius: 8, fontWeight: 600 }}>⭐ {hotel.rating}</span>
                <span style={{ background: "#F0F9FF", color: "#2B6BC6", padding: "6px 10px", borderRadius: 8, fontWeight: 700 }}>€{hotel.price} / night</span>
              </div>

              <p style={{ marginTop: 18, color: "#475569", lineHeight: 1.6 }}>
                A lovely stay located in {hotel.location}. Comfortable rooms, friendly staff and great nearby attractions — perfect for a relaxing French getaway.
              </p>
            </div>

            {/* small action panel */}
            <aside style={{ width: 260, borderLeft: "1px solid #EEF2F7", paddingLeft: 20 }}>
              <div style={{ background: "#FEF6F6", padding: 16, borderRadius: 12, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)" }}>
                <div style={{ fontSize: 13, color: "#9AA3B2" }}>From</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#2B6BC6", marginTop: 6 }}>€{hotel.price}</div>
                <div style={{ marginTop: 12 }}>
                  <Link href={`/book/${hotel.id}/confirm`} style={{ display: "block", padding: "10px 12px", background: "linear-gradient(90deg,#FF8AA1,#6BA8FF)", color: "white", borderRadius: 10, textAlign: "center", textDecoration: "none", fontWeight: 700 }}>
                    Continue to Booking
                  </Link>
                  <Link href="/" style={{ display: "block", padding: "10px 12px", marginTop: 10, background: "#F3F4F6", color: "#1F2937", borderRadius: 10, textAlign: "center", textDecoration: "none", fontWeight: 600 }}>
                    Back to Home
                  </Link>
                </div>
              </div>

              <div style={{ marginTop: 18, fontSize: 13, color: "#64748B" }}>
                <strong>Free cancellation</strong> within 24 hours. Taxes and fees included.
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
