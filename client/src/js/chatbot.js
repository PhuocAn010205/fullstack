document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("chatbot-container");
  if (!container) return;

  container.innerHTML = `
    <div class="chat-container" id="chatWindow">
      <div class="chat-header">
        <i class="fa-solid fa-circle" style="color: #00ff2a;"></i> Tư vấn UTHCare
        <span class="chat-close" onclick="closeChatbot()">✖</span>
      </div>
      <div class="chat-body" id="chatBody">
        <div class="bot-message">Xin chào! Bạn cần tư vấn gì về sản phẩm?</div>
      </div>
      <div class="chat-input">
        <input type="text" placeholder="Nhập câu hỏi..." />
        <button>Gửi</button>
      </div>
    </div>
  `;

  const inputField = container.querySelector("input");
  const sendButton = container.querySelector("button");
  const chatBody = container.querySelector("#chatBody");

  sendButton.addEventListener("click", async () => {
    const message = inputField.value.trim();
    if (!message) return;

    const userMsg = document.createElement("div");
    userMsg.textContent = message;
    userMsg.className = "user-message";
    chatBody.appendChild(userMsg);

    const reply = await fetchProductReply(message);

    const botReply = document.createElement("div");
    botReply.textContent = reply;
    botReply.className = "bot-message";
    chatBody.appendChild(botReply);

    inputField.value = "";
    chatBody.scrollTop = chatBody.scrollHeight;
  });
});

// Đóng/mở chatbot
function toggleChatbot() {
  const chatWindow = document.querySelector(".chat-container");
  if (chatWindow) {
    chatWindow.style.display =
      chatWindow.style.display === "none" || !chatWindow.style.display
        ? "block"
        : "none";
  }
}
function closeChatbot() {
  const chatWindow = document.querySelector(".chat-container");
  if (chatWindow) chatWindow.style.display = "none";
}

// Trả lời theo file JSON
async function fetchProductReply(userMessage) {
  try {
    const response = await fetch("../products.json");
    const data = await response.json();
    const lowerMsg = userMessage.toLowerCase();

    for (let item of data) {
      if (item.keyword.some((kw) => lowerMsg.includes(kw))) {
        return `🔎 Gợi ý cho bạn:
• ${item.name}
• Thương hiệu: ${item.brand} (${item.origin})
👉 ${item.description}`;
      }
    }
    return "Rất tiếc mình chưa tìm thấy sản phẩm phù hợp. Bạn có thể nhập từ khóa khác thử nha!";
  } catch (err) {
    return "Lỗi tải dữ liệu. Huy kiểm tra đường dẫn đến file JSON nhé!";
  }
}
