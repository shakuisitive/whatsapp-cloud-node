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

app.post("/webhook", (req, res) => {
  console.log(JSON.stringify(req.body, null, 2))
  return res.status(200).send("Webhook received")
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
  return response.data;
}

app.listen(3000, () => {
  console.log("Server is running on port 3000");
  sendMessage("923132307538", "Hello, how are you? I am a text message.").catch(
    console.error
  );
});