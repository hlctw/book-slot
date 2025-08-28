const { createClient } = window.supabase;

// 請替換成您實際的值
const supabaseUrl = "https://zcauebtlabxyijhafexr.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjYXVlYnRsYWJ4eWlqaGFmZXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxODcwNDQsImV4cCI6MjA3MTc2MzA0NH0.F8auMujCIxl3umWj7O5jp9N8QfbPrFJ06McYiz3y49I";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getSessions(filter = {}) {
  try {
    console.log("🔍 開始查詢，篩選條件：", filter);

    // 先嘗試最簡單的查詢
    const { data, error } = await supabase
      .from("Sessions") // 注意大小寫
      .select("*");

    console.log("📊 Supabase 回應：");
    console.log("  資料：", data);
    console.log("  錯誤：", error);

    if (error) {
      console.error("❌ Supabase 錯誤：", error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log("⚠️ 資料表是空的或查詢結果為空");
      return [];
    }

    console.log("✅ 成功取得", data.length, "筆資料");
    return data;
  } catch (err) {
    console.error("💥 程式執行錯誤：", err);
    return [];
  }
}
