import { supabase } from "../lib/supabase";

export default async function handler(req, res) {
  if (req.method === "GET") {
    let query = supabase.from("sessions").select("*").eq("status", "open");
    const { date, q } = req.query;
    if (date) query = query.ilike("start_date", `${date}%`);
    if (q) {
      query = query.or(
        `title.ilike.%${q}%,organizer.ilike.%${q}%,book_title.ilike.%${q}%`
      );
    }
    const { data, error } = await query;
    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
  } else {
    res.status(405).json({ error: "不支援此方法" });
  }
}
