import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {
  const { data, error } = await supabase.from("hotels").select("*").limit(1);
  if (error) {
    console.error("❌ Supabase Connection Failed:", error);
    return Response.json({ ok: false, error });
  }

  return Response.json({ ok: true, data });
}
