// 注意：是 window.supabase.createClient，不是 window.supabase
const supabaseUrl = "https://zcauebtlabxyijhafexr.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjYXVlYnRsYWJ4eWlqaGFmZXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxODcwNDQsImV4cCI6MjA3MTc2MzA0NH0.F8auMujCIxl3umWj7O5jp9N8QfbPrFJ06McYiz3y49I";

const { createClient } = window.supabase;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getSessions(filter = {}) {
  let query = supabase.from("Sessions").select("*").eq("status", "open");

  if (filter.date) {
    query = query.ilike("startDate", filter.date + "%");
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

  return data || [];
}
