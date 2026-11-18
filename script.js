// Paste the Cloudflare Worker URL here after it has been deployed.
const WORKER_URL = "https://loreal-chatbot.jahasbun.workers.dev";

// Keep the conversation so the assistant can remember earlier questions.
let conversationHistory = [];

// Get the parts of the page that we will update.
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const sendBtn = document.getElementById("sendBtn");

// Add a message as text, so user input is displayed safely.
function addMessage(role, text) {
  const message = document.createElement("article");
  message.className = `message ${role}`;

  const label = document.createElement("span");
  label.className = "message-label";
  label.textContent = role === "user" ? "You" : "Beauty assistant";

  const bubble = document.createElement("p");
  bubble.className = "message-bubble";
  bubble.textContent = text;

  message.append(label, bubble);
  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return message;
}

// Start with a friendly greeting.
addMessage(
  "assistant",
  "Hello! I’m your L’Oréal Beauty Assistant. Ask me about skincare, makeup, haircare, or fragrance.",
);

// Send the user's question to the Cloudflare Worker and show its reply.
chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const question = userInput.value.trim();
  if (!question) {
    return;
  }

  addMessage("user", question);
  userInput.value = "";

  if (WORKER_URL.includes("YOUR-WORKER-NAME")) {
    addMessage(
      "assistant",
      "This chatbot is not connected yet. Add your deployed Cloudflare Worker URL to WORKER_URL in script.js.",
    );
    return;
  }

  userInput.disabled = true;
  sendBtn.disabled = true;
  sendBtn.setAttribute("aria-label", "Sending message");

  const loadingMessage = addMessage("assistant", "Thinking…");

  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [...conversationHistory, { role: "user", content: question }].slice(-20),
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "The request could not be completed.");
    }

    const reply = data.choices?.[0]?.message?.content;
    if (typeof reply !== "string" || !reply.trim()) {
      throw new Error("The assistant returned an empty reply. Please try again.");
    }

    conversationHistory = [
      ...conversationHistory,
      { role: "user", content: question },
      { role: "assistant", content: reply },
    ].slice(-20);

    loadingMessage.remove();
    addMessage("assistant", reply);
  } catch (error) {
    console.error("Chat request failed:", error);
    loadingMessage.remove();
    addMessage(
      "assistant",
      `Sorry, I couldn’t get a reply. ${error.message} Please check the Worker URL and try again.`,
    );
  } finally {
    userInput.disabled = false;
    sendBtn.disabled = false;
    sendBtn.setAttribute("aria-label", "Send message");
    userInput.focus();
  }
});
