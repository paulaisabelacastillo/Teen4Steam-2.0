async function getGPTResponse(prompt) {
  try {
    const response = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: prompt })
    });

    if (!response.ok) {
      console.warn("Servidor respondió con error:", response.status);
      return getOfflineResponse(prompt);
    }

    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.warn("No se pudo conectar al servidor. Se usará respuesta local.");
    return getOfflineResponse(prompt);
  }
}

function getOfflineResponse(userMessage) {
  const lower = userMessage.toLowerCase();

  // Saludos
  if (lower.includes("hola") || lower.includes("buenas")) {
    return "¡Hola! Qué gusto saludarte 😊";
  }

  // ¿Cómo estás?
  if (
    lower.includes("como estas") ||
    lower.includes("¿cómo estás") ||
    lower.includes("como te encuentras") ||
    lower.includes("qué tal") ||
    lower.includes("que tal")
  ) {
    return "¡Estoy muy bien, gracias por preguntar! ¿Y tú? 😄";
  }

  // ¿Qué haces?
  if (lower.includes("qué haces") || lower.includes("que haces")) {
    return "Estoy aquí esperando tus preguntas 🤖";
  }

  // Agradecimientos
  if (lower.includes("gracias")) {
    return "¡De nada! Me encanta ayudarte 😊";
  }

  // ¿Quién eres?
  if (lower.includes("quién eres") || lower.includes("quien eres")) {
    return "Soy tu tutor virtual, listo para aprender contigo 📚";
  }

  // Despedidas
  if (lower.includes("adiós") || lower.includes("chao") || lower.includes("hasta luego")) {
    return "¡Hasta luego! Que tengas un día increíble 🌟";
  }

  // Respuesta por defecto
  return "¡Qué interesante! Cuéntame más o hazme otra pregunta ✨";
}


function appendMessage(message, sender) {
  const chatBox = document.getElementById("chat-box");
  const msg = document.createElement("p");
  msg.className = sender === "user" ? "user-message" : "bot-message";
  msg.textContent = message;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("user-input");
  const userText = input.value.trim();
  if (!userText) return;

  appendMessage(userText, "user");
  input.value = "";

  appendMessage("⏳ Pensando...", "bot");

  const botResponses = document.querySelectorAll(".bot-message");
  const lastBotMsg = botResponses[botResponses.length - 1];

  const reply = await getGPTResponse(userText);
  lastBotMsg.textContent = reply;
}

document.getElementById("send-btn").addEventListener("click", sendMessage);
document.getElementById("user-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});