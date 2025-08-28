import { getSessions, createSession } from "./sessions.js";

// 搜尋功能
async function loadSessions() {
  const filter = {
    date: document.getElementById("searchDate")?.value || "",
    q: document.getElementById("searchKeyword")?.value || "",
  };

  console.log("🔍 開始搜尋，篩選條件：", filter);

  const sessions = await getSessions(filter);
  const container = document.getElementById("courseList");

  if (!container) return;

  if (!sessions.length) {
    container.innerHTML =
      '<p style="text-align: center; padding: 20px;">查無結果</p>';
    return;
  }

  container.innerHTML = sessions
    .map(
      (s) => `
    <div class="course-card" style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px; background: white;">
      <h3>📖 ${s.title}</h3>
      <p><strong>📚 書目：</strong>${s.bookTitle}</p>
      <p><strong>📅 時間：</strong>${s.startDate} ${s.startTime} - ${s.endTime}</p>
      <p><strong>👤 主揪：</strong>${s.organizer}</p>
      <p><strong>👥 人數：</strong>${s.capacity} 人</p>
      <p><strong>🔗 Zoom ID：</strong>${s.zoomId}</p>
      <button style="padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">📝 加入課程</button>
    </div>
  `
    )
    .join("");

  console.log(`✅ 已顯示 ${sessions.length} 個課程`);
}

// 載入所有課程
async function loadAllSessions() {
  const sessions = await getSessions({});
  const container = document.getElementById("courseList");

  if (!container) return;

  if (!sessions.length) {
    container.innerHTML =
      '<p style="text-align: center; padding: 20px;">目前沒有課程</p>';
    return;
  }

  container.innerHTML = sessions
    .map(
      (s) => `
    <div class="course-card" style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px; background: white;">
      <h3>📖 ${s.title}</h3>
      <p><strong>📚 書目：</strong>${s.bookTitle}</p>
      <p><strong>📅 時間：</strong>${s.startDate} ${s.startTime} - ${s.endTime}</p>
      <p><strong>👤 主揪：</strong>${s.organizer}</p>
      <p><strong>👥 人數：</strong>${s.capacity} 人</p>
      <p><strong>🔗 Zoom ID：</strong>${s.zoomId}</p>
      <button style="padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">📝 加入課程</button>
    </div>
  `
    )
    .join("");

  console.log(`✅ 已載入 ${sessions.length} 個課程`);
}

// 建立共背團功能
async function handleCreateSession() {
  console.log("🎯 開始建立共背團...");

  // 收集表單資料
  const formData = {
    title: document.getElementById("title")?.value || "",
    bookTitle: document.getElementById("bookTitle")?.value || "",
    startDate: document.getElementById("startDate")?.value || "",
    startTime: document.getElementById("startTime")?.value || "",
    endTime: document.getElementById("endTime")?.value || "",
    timezone: document.getElementById("timezone")?.value || "Asia/Taipei",
    repeatType: document.getElementById("repeatType")?.value || "none",
    organizer: document.getElementById("organizer")?.value || "",
    capacity: document.getElementById("capacity")?.value || "10",
    zoomId: document.getElementById("zoomId")?.value || "",
    zoomPass: document.getElementById("zoomPass")?.value || "",
    zoomLink: document.getElementById("zoomLink")?.value || "",
  };

  // 表單驗證
  if (
    !formData.title ||
    !formData.bookTitle ||
    !formData.startDate ||
    !formData.startTime ||
    !formData.endTime ||
    !formData.organizer ||
    !formData.zoomId
  ) {
    showMessage("❌ 請填寫所有必要欄位", "error");
    return;
  }

  // 顯示載入狀態
  const createBtn = document.getElementById("createBtn");
  if (createBtn) {
    createBtn.disabled = true;
    createBtn.textContent = "建立中...";
  }

  // 建立課程
  const result = await createSession(formData);

  if (result.success) {
    showMessage("✅ 共背團建立成功！", "success");
    resetCreateForm();

    // 3秒後切換到搜尋頁籤
    setTimeout(() => {
      showSearchTab();
      loadAllSessions();
    }, 2000);
  } else {
    showMessage("❌ 建立失敗：" + result.error, "error");
  }

  // 恢復按鈕狀態
  if (createBtn) {
    createBtn.disabled = false;
    createBtn.textContent = "✨ 建立共背團";
  }
}

// 重置表單
function resetCreateForm() {
  const form = document.getElementById("createForm");
  if (form) {
    form.reset();
  }
}

// 顯示訊息
function showMessage(message, type) {
  let messageDiv = document.getElementById("createMessage");
  if (!messageDiv) {
    messageDiv = document.createElement("div");
    messageDiv.id = "createMessage";
    document.getElementById("createTab")?.appendChild(messageDiv);
  }

  messageDiv.className = `message message-${type}`;
  messageDiv.innerHTML = message;
  messageDiv.style.padding = "15px";
  messageDiv.style.margin = "15px 0";
  messageDiv.style.borderRadius = "8px";
  messageDiv.style.textAlign = "center";

  if (type === "success") {
    messageDiv.style.background = "#d4edda";
    messageDiv.style.color = "#155724";
    messageDiv.style.border = "1px solid #c3e6cb";
  } else if (type === "error") {
    messageDiv.style.background = "#f8d7da";
    messageDiv.style.color = "#721c24";
    messageDiv.style.border = "1px solid #f5c6cb";
  }

  // 3秒後自動隱藏訊息
  setTimeout(() => {
    if (messageDiv) {
      messageDiv.style.display = "none";
    }
  }, 3000);
}

// 頁面切換功能
function showSearchTab() {
  const searchTab =
    document.getElementById("searchTab") ||
    document.querySelector('[class*="search"]');
  const createTab =
    document.getElementById("createTab") ||
    document.querySelector('[class*="create"]');
  const searchBtn =
    document.querySelector('button:contains("我時段加入")') ||
    document.querySelector(".tab-button:first-child");
  const createBtn =
    document.querySelector('button:contains("建立共背團")') ||
    document.querySelector(".tab-button:last-child");

  if (searchTab) searchTab.style.display = "block";
  if (createTab) createTab.style.display = "none";
  if (searchBtn) searchBtn.classList.add("active");
  if (createBtn) createBtn.classList.remove("active");
}

function showCreateTab() {
  const searchTab =
    document.getElementById("searchTab") ||
    document.querySelector('[class*="search"]');
  const createTab =
    document.getElementById("createTab") ||
    document.querySelector('[class*="create"]');
  const searchBtn =
    document.querySelector('button:contains("我時段加入")') ||
    document.querySelector(".tab-button:first-child");
  const createBtn =
    document.querySelector('button:contains("建立共背團")') ||
    document.querySelector(".tab-button:last-child");

  if (searchTab) searchTab.style.display = "none";
  if (createTab) createTab.style.display = "block";
  if (searchBtn) searchBtn.classList.remove("active");
  if (createBtn) createBtn.classList.add("active");
}

// 綁定所有事件
document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ 頁面載入完成，開始綁定事件...");

  // 搜尋功能綁定
  const searchBtn = document.getElementById("searchBtn");
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      console.log("🔍 搜尋按鈕被點擊");
      loadSessions();
    });
  }

  // 建立共背團按鈕綁定
  const createBtn =
    document.getElementById("createBtn") ||
    document.querySelector('button:contains("建立共背團")');
  if (createBtn) {
    createBtn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("🎯 建立按鈕被點擊");
      handleCreateSession();
    });
  }

  // 頁籤切換按鈕綁定
  const tabButtons = document.querySelectorAll(".tab-button");
  tabButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      if (index === 0) {
        showSearchTab();
      } else {
        showCreateTab();
      }
    });
  });

  // 全域函數
  window.loadAllSessions = loadAllSessions;
  window.showSearchTab = showSearchTab;
  window.showCreateTab = showCreateTab;
  window.handleCreateSession = handleCreateSession;

  console.log("✅ 所有事件綁定完成");
});
