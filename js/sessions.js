// ✅ 在瀏覽器用 CDN 版本時，建議直接用 window.supabase.createClient
const supabaseUrl = "https://zcauebtlabxyijhafexr.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjYXVlYnRsYWJ4eWlqaGFmZXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzNzI4MTMsImV4cCI6MjA1MDk0ODgxM30.kzBQy6WZ0_e9bX8gJlYBhE8rHwE8CWYOdBmGkPKqO5A";

const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

export async function getSessions(filter) {
  try {
    let query = supabase.from("Sessions").select("*").eq("status", "open");

    if (filter?.date) {
      // 若需要用到時間上限，也可加 .lte('endDate', ...)
      query = query.gte("startDate", filter.date);
    }

    if (filter?.q) {
      const keyword = filter.q.trim();
      if (keyword) {
        // ✅ or(...) 寫法正確，保留
        // 如果擔心關鍵字中有逗號干擾，可先做簡單轉義：const k = keyword.replaceAll(',', '\\,')
        query = query.or(
          `title.ilike.%${keyword}%,bookTitle.ilike.%${keyword}%,organizer.ilike.%${keyword}%`
        );
      }
    }

    const { data, error } = await query.order("startDate", { ascending: true });

    if (error) {
      console.error("查詢錯誤:", error);
      return [];
    }

    return data ?? [];
  } catch (err) {
    console.error("執行錯誤:", err);
    return [];
  }
}

export async function createSession(formData) {
  try {
    const sessionData = {
      title: formData.title,
      bookTitle: formData.bookTitle,
      startDate: formData.startDate,
      endDate: formData.endDate || formData.startDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      timezone: formData.timezone || "Asia/Taipei",
      organizer: formData.organizer,
      capacity: Number(formData.capacity) || 10,
      zoomId: formData.zoomId,
      zoomPass: formData.zoomPass || "",
      status: "open",
      createdAt: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("Sessions")
      .insert([sessionData])
      .select();

    if (error) {
      console.error("建立失敗:", error);
      return { success: false, error: error.message };
    }

    console.log("建立成功:", data);
    // ❌ 原本寫法少了 key，會拋錯：return { success: true,  data[0] }
    // ✅ 正確：
    return { success: true, data: data?.[0] };
  } catch (err) {
    console.error("建立過程錯誤:", err);
    return { success: false, error: err.message };
  }
}
