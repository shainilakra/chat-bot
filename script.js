const API_KEY = "AIzaSyBduq-Og961LhZrchgonXSNR5N5rQVT9XI";
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const chatMessage = document.getElementById("chat-message");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

async function generateResponse(prompt) {
  const response = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error("Failed to get response");
  }

  const data = await response.json();

  if (!data.candidates || !data.candidates.length) {
    throw new Error("No AI response");
  }

  return data.candidates[0].content.parts[0].text;
}

function cleanMarkdown(text) {
  return text
    .replace(/#{1,6}\s?/g, "")
    .replace(/\*\*/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function addMessage(message, isUser) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", isUser ? "user-message" : "bot-message");

  const profileImage = document.createElement("img");
  profileImage.classList.add("profile-image");
  profileImage.src = isUser ? "user.jpg" : "bot.jpg";
  profileImage.alt = isUser ? "user" : "bot";

  const messageContent = document.createElement("div");
  messageContent.classList.add("message-content");
  messageContent.textContent = message;

  messageElement.appendChild(profileImage);
  messageElement.appendChild(messageContent);
  chatMessage.appendChild(messageElement);

  // Auto scroll
  chatMessage.scrollTop = chatMessage.scrollHeight;
}

async function handleUserInput() {
  const userMessage = userInput.value.trim(); 

  if (!userMessage) return;

  addMessage(userMessage, true);
  userInput.value = "";
  sendButton.disabled = true;
  userInput.disabled = true;

  try {
    const botMessage = await generateResponse(userMessage);
    addMessage(cleanMarkdown(botMessage), false);
  } catch (error) {
    console.error(error);
    addMessage("Sorry, I am unable to respond right now.", false);
  } finally {
    sendButton.disabled = false;
    userInput.disabled = false;
    userInput.focus();
  }
}

sendButton.addEventListener("click", handleUserInput);

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleUserInput();
  }
});

  