document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("chatbot-container");
  if (!container) return;

  container.innerHTML = `
    <div class="chat-container" id="chatWindow">
      <div class="chat-header">
        💬 Tư vấn UTHCare
        <span class="chat-close" onclick="closeChatbot()">✖</span>
      </div>
      <div class="chat-body" id="chatBody">
        <div class="bot-message">Xin chào! Bạn cần hỗ trợ gì về sản phẩm?</div>
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

  sendButton.addEventListener("click", () => {
    const message = inputField.value.trim();
    if (!message) return;

    const userMsg = document.createElement("div");
    userMsg.textContent = message;
    userMsg.className = "user-message";
    chatBody.appendChild(userMsg);

    let reply = "Cảm ơn bạn đã hỏi! Bạn đang cần sản phẩm nào để mình tư vấn thêm nhé.";

const msg = message.toLowerCase();

// Phản hồi theo từ khóa nhu cầu
if (msg.includes("bao cao su")) {
  reply = `Một số sản phẩm bạn có thể tham khảo:
• Sagami Classic – siêu mỏng, không mùi (SAGAMI - Nhật)
• Safefit S52 – làm mát, kéo dài thời gian (SAFEFIT - Việt Nam)
• DUREX Performa – có gel bôi trơn, tăng thời gian (DUREX - Thái)`;
} else if (msg.includes("hạ sốt") || msg.includes("sốt") || msg.includes("giảm đau")) {
  reply = `Để hạ sốt và giảm đau, bạn có thể dùng:
• Panadol viên sủi – giảm đau và hạ sốt nhanh (GSK - Việt Nam)
• Hapacol 325mg – dạng viên nén tiện lợi (DHG Pharma - Việt Nam)
• Miếng dán Bye Bye Fever – mát lạnh đến 10 giờ (Nhật)`;
} else if (msg.includes("cảm cúm") || msg.includes("ho")) {
  reply = `Nếu bạn đang bị cảm cúm hoặc ho:
• Decolgen Forte – giảm nhanh các triệu chứng cảm
• Siro ho thảo dược – nhẹ dịu, dùng được cho nhiều đối tượng`;
} else if (msg.includes("kem dưỡng") || msg.includes("dưỡng ẩm")) {
  reply = `Để dưỡng da mềm mịn, bạn có thể chọn:
• NIVEA Soft – dành cho da khô (Đức)
• Vaseline Pure – dưỡng ẩm sâu (Hà Lan)
• Hatomugi Hand Cream – dưỡng da tay nhẹ dịu (Nhật)`;
} else if (msg.includes("khử mùi") || msg.includes("lăn nách")) {
  reply = `Khử mùi hiệu quả bạn có thể dùng:
• Enchantuer Charming – thơm lâu, dịu nhẹ (Việt Nam)
• Etiaxil Sensitive – dành cho da nhạy cảm (Đan Mạch)
• Refre Whitening – hương sang trọng (Việt Nam)`;
} else if (msg.includes("thuốc nhỏ mắt") || msg.includes("mỏi mắt") || msg.includes("khô mắt")) {
  reply = `Nếu mắt bạn bị khô hay mỏi:
• Osla – phòng ngừa khô mắt (Merap - Việt Nam)
• VRohto New – giảm đỏ và mỏi mắt (Vrohto - Việt Nam)
• Avisla – dưỡng mắt dịu nhẹ (Gia Nguyễn - Việt Nam)`;
} else if (msg.includes("nước hoa")) {
  reply = `Bạn có thể chọn:
• Feliz Perfume Provence – hương hoa nữ tính (Việt Nam)
• Refre Deluxe – hương nước hoa sang trọng (Việt Nam)`;
}


    const botReply = document.createElement("div");
    botReply.textContent = reply;
    botReply.className = "bot-message";
    chatBody.appendChild(botReply);

    inputField.value = "";
    chatBody.scrollTop = chatBody.scrollHeight;
  });
});

// Hàm mở / đóng chatbot
function toggleChatbot() {
  const chatWindow = document.querySelector(".chat-container");
  if (chatWindow) {
    chatWindow.style.display = (chatWindow.style.display === "none" || !chatWindow.style.display) ? "block" : "none";
  }
}

function closeChatbot() {
  const chatWindow = document.querySelector(".chat-container");
  if (chatWindow) chatWindow.style.display = "none";
}
