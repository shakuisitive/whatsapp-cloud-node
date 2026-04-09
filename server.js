require("dotenv").config();

const axios = require("axios");
const express = require("express");

const app = express();
app.use(express.json());

app.get("/webhook", (req, res) => {

  const mode = req.query["hub.mode"];
  const challenge = req.query["hub.challenge"];
  const token = req.query["hub.verify_token"];

  if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    return res.status(200).send(challenge)
  } else {
    return res.status(400).send("Invalid token")
  }

})

app.post("/webhook", async (req, res) => {
  const { entry } = req.body;

  if (!entry || !entry.length) return res.status(400).send("Invalid Request")

  const changes = entry[0].changes

  if (!changes || !changes.length) return res.status(400).send("Invalid Request")

  const statuses = changes[0].value.statuses ? changes[0].value.statuses[0] : null;
  const messages = changes[0].value.messages ? changes[0].value.messages[0] : null;

  if (statuses) {
    console.log(`
      MESSAGE STATUS UPDATE:
      ID: ${statuses.id}
      STATUS: ${statuses.status}
      `);
  }

  if (messages) {
    if (messages.type === "text" && messages.text.body === "Hello") {
      await replyMessage(messages.from, "Hey,how can I help you today?", messages.id);
    }
  }
  return res.status(200).send("Webhook processed successfully");

})

async function sendMessage(to, message) {
  const response = await axios.post(
    "https://graph.facebook.com/v25.0/1035262463009774/messages",
    {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: message },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
}

async function replyMessage(to, message, messageId) {
  const response = await axios.post(
    "https://graph.facebook.com/v25.0/1035262463009774/messages",
    {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: message },
      context: {
        message_id: messageId,
      }
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
}

app.listen(3000, () => {
  console.log("Server is running on port 3000");
  // sendMessage("923132307538", "Hello, how are you? I am a text message.").catch(
  //   console.error
  // ); 
});