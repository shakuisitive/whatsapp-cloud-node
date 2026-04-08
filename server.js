require("dotenv").config();

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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
})