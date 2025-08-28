const supabaseUrl = "https://YOUR_SUPABASE_URL";
const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY";

async function loadAllCourses() {
  setStatus("🔄 載入課程中...", "loading");
  try {
    const res = await fetch("/api/sessions");
    if (!res.ok) throw new Error(await res.text());
    const courses = await res.json();
    allCourses = courses;
    displayCourses(allCourses);
    setStatus("✅ 載入完成", "success");
  } catch (err) {
    setStatus("❌ 載入失敗: " + err.message, "error");
  }
}

async function createCourse() {
  setStatus("🔄 建立課程中...", "loading");
  const data = {
    /* 從表單取得資料 */
  };
  try {
    const res = await fetch("/api/create-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (result.success) {
      setStatus("✅ 建立成功", "success");
      loadAllCourses();
    } else {
      setStatus("❌ 建立失敗: " + (result.error || "未知錯誤"), "error");
    }
  } catch (err) {
    setStatus("❌ 建立錯誤: " + err.message, "error");
  }
}

// 其他 UI、重複日期計算等函式，依您現有功能調整
