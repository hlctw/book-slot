import { supabase } from "../lib/supabase";

function generateRepeatDates(
  startDate,
  repeatType,
  repeatDays,
  repeatDuration,
  repeatUnit
) {
  // 將您原 Google Script 內_generateRepeatDates_邏輯，改寫成 JS 函式
  // 回傳日期陣列
  // 範例略，須按照需求自行完成
  return [startDate]; // 單次課程示意
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;
    try {
      if (
        !data.title ||
        !data.bookTitle ||
        !data.startDate ||
        !data.startTime ||
        !data.endTime ||
        !data.zoomId
      ) {
        throw new Error("必要欄位不完整");
      }
      const dates = generateRepeatDates(
        data.startDate,
        data.repeatType,
        data.repeatDays,
        data.repeatDuration,
        data.repeatUnit
      );

      for (const date of dates) {
        const session = {
          ...data,
          start_date: date,
          end_date: dates[dates.length - 1],
          created_at: new Date().toISOString(),
          status: "open",
        };
        const { error } = await supabase.from("sessions").insert([session]);
        if (error) throw error;
      }
      res.status(200).json({ success: true, count: dates.length });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "只支援POST" });
  }
}
