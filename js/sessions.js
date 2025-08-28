import { supabase } from "../lib/supabase.js";

// 讀取所有開放課程
export async function getSessions(filter = {}) {
  let query = supabase.from("Sessions").select("*").eq("status", "open");

  if (filter.date) {
    query = query.ilike("startDate", filter.date + "%"); // 模糊日期搜尋
  }

  if (filter.q) {
    const text = filter.q.trim();
    query = query.or(
      `title.ilike.%${text}%,organizer.ilike.%${text}%,bookTitle.ilike.%${text}%`
    );
  }

  const { data, error } = await query.order("startDate", { ascending: true });

  if (error) {
    console.error("讀取課程錯誤:", error);
    return [];
  }

  return data;
}
