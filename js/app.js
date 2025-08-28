import { getSessions } from "./sessions.js";

async function loadSessions() {
  const filter = {
    date: document.getElementById("searchDate").value,
    q: document.getElementById("searchKeyword").value,
  };

  const sessions = await getSessions(filter);
  const container = document.getElementById("courseList");

  if (!sessions.length) {
    container.innerHTML = "<p>查無結果</p>";
    return;
  }

  container.innerHTML = sessions
    .map(
      (s) => `
    <div class="course-card">
      <h3>${s.title}</h3>
      <p>主揪：${s.organizer}</p>
      <p>開始日期：${s.startDate} ${s.startTime}</p>
      <p>書目：${s.bookTitle}</p>
      <p>Zoom ID：${s.zoomId}</p>
    </div>
  `
    )
    .join("");
}

// 搜尋按鈕綁定
document.getElementById("searchBtn").addEventListener("click", () => {
  loadSessions();
});

// 頁面讀取後載入
window.onload = () => {
  loadSessions();
};
