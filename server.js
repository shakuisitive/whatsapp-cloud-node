require("dotenv").config();

const axios = require("axios");
const express = require("express");

const app = express();
app.use(express.json());

const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID || "1035262463009774";
const GRAPH_MESSAGES_URL = `https://graph.facebook.com/v25.0/${PHONE_NUMBER_ID}/messages`;

function graphHeaders() {
  return {
    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
    "Content-Type": "application/json",
  };
}

function logGraphError(err, label) {
  console.error(
    label,
    JSON.stringify(err.response?.data ?? err.message, null, 2)
  );
}

app.get("/", (req, res) => {
  res.send("WhatsApp with Node.js and Webhooks");
});

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const challenge = req.query["hub.challenge"];
  const token = req.query["hub.verify_token"];

  if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
  const { entry } = req.body;

  if (!entry || entry.length === 0) {
    return res.status(400).send("Invalid Request");
  }

  const changes = entry[0].changes;
  if (!changes || changes.length === 0) {
    return res.status(400).send("Invalid Request");
  }

  const statuses = changes[0].value.statuses
    ? changes[0].value.statuses[0]
    : null;
  const messages = changes[0].value.messages
    ? changes[0].value.messages[0]
    : null;

  if (statuses) {
    console.log(`
MESSAGE STATUS UPDATE:
ID: ${statuses.id}
STATUS: ${statuses.status}
`);
  }

  if (messages) {
    try {
      if (messages.type === "text") {
        const body = messages.text?.body?.toLowerCase() ?? "";

        if (body === "hello") {
          await replyMessage(
            messages.from,
            "Hello. How are you?",
            messages.id
          );
        }
        if (body === "list") {
          await sendList(messages.from);
        }
        if (body === "buttons") {
          await sendReplyButtons(messages.from);
        }
      }

      if (messages.type === "interactive") {
        if (messages.interactive.type === "list_reply") {
          const lr = messages.interactive.list_reply;
          await sendMessage(
            messages.from,
            `You selected list option id ${lr.id} — ${lr.title}`
          );
        }
        if (messages.interactive.type === "button_reply") {
          const br = messages.interactive.button_reply;
          await sendMessage(
            messages.from,
            `You selected button id ${br.id} — ${br.title}`
          );
        }
      }

      console.log(JSON.stringify(messages, null, 2));
    } catch (err) {
      console.error("Webhook handler:", err.message);
    }
  }

  return res.status(200).send("Webhook processed");
});

async function sendMessage(to, text) {
  const response = await axios.post(
    GRAPH_MESSAGES_URL,
    {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text },
    },
    { headers: graphHeaders() }
  );
  return response.data;
}

async function replyMessage(to, text, messageId) {
  const response = await axios.post(
    GRAPH_MESSAGES_URL,
    {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text },
      context: { message_id: messageId },
    },
    { headers: graphHeaders() }
  );
  return response.data;
}

async function sendList(to) {
  try {
    const response = await axios.post(
      GRAPH_MESSAGES_URL,
      {
        messaging_product: "whatsapp",
        to,
        type: "interactive",
        interactive: {
          type: "list",
          header: { type: "text", text: "Message Header" },
          body: { text: "This is an interactive list message" },
          footer: { text: "This is the message footer" },
          action: {
            button: "Tap for options",
            sections: [
              {
                title: "First Section",
                rows: [
                  {
                    id: "first_option",
                    title: "First option",
                    description: "Description of the first option",
                  },
                  {
                    id: "second_option",
                    title: "Second option",
                    description: "Description of the second option",
                  },
                ],
              },
              {
                title: "Second Section",
                rows: [
                  {
                    id: "third_option",
                    title: "Third option",
                    description: "Description of the third option",
                  },
                ],
              },
            ],
          },
        },
      },
      { headers: graphHeaders() }
    );
    return response.data;
  } catch (err) {
    logGraphError(err, "sendList");
    throw err;
  }
}

async function sendReplyButtons(to) {
  try {
    const response = await axios.post(
      GRAPH_MESSAGES_URL,
      {
        messaging_product: "whatsapp",
        to,
        type: "interactive",
        interactive: {
          type: "button",
          header: { type: "text", text: "Message Header" },
          body: { text: "This is an interactive reply buttons message" },
          footer: { text: "This is the message footer" },
          action: {
            buttons: [
              {
                type: "reply",
                reply: { id: "first_button", title: "First Button" },
              },
              {
                type: "reply",
                reply: { id: "second_button", title: "Second Button" },
              },
            ],
          },
        },
      },
      { headers: graphHeaders() }
    );
    return response.data;
  } catch (err) {
    logGraphError(err, "sendReplyButtons");
    throw err;
  }
}

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
