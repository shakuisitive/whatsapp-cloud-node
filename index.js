require("dotenv").config();

const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

async function sendTemplateMessage() {
  try {
    const response = await axios({
      url: "https://graph.facebook.com/v25.0/1035262463009774/messages",
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      },
      data: JSON.stringify({
        "messaging_product": "whatsapp",
        "to": "923132307538",
        "type": "template",
        "template": {
          "name": "hello_world",
          "language": {
            "code": "en_US"
          }
        }
      })
    })

    console.log({
      data: response.data,
      message: "Message sent successfully"
    })
  } catch (error) {
    console.log(error);
  }
}

async function sendTextMessage() {
  try {
    const response = await axios({
      url: "https://graph.facebook.com/v25.0/1035262463009774/messages",
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      },
      data: JSON.stringify({
        "messaging_product": "whatsapp",
        "to": "923132307538",
        "type": "text",
        "text": {
          "body": "Hello, how are you? I am a text message."
        }
      })
    })

    console.log({
      data: response.data,
      message: "Message sent successfully"
    })

  } catch (error) {
    console.log(error);
  }
}

async function sendMediaMessage() {
  try {
    const response = await axios({
      url: "https://graph.facebook.com/v25.0/1035262463009774/messages",
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      },
      data: JSON.stringify({
        "messaging_product": "whatsapp",
        "to": "923132307538",
        "type": "image",
        "image": {
          "id": "1696936598404799"
        },
      })
    })

    console.log({
      data: response.data,
      message: "Message sent successfully"
    })

  } catch (error) {
    console.log(error);
  }
}

async function uploadImage() {
  try {
    const data = new FormData();
    data.append("messaging_product", "whatsapp")
    data.append("file", fs.createReadStream(process.cwd() + "/bingus love.png"), {
      "contentType": "image/png"
    });
    data.append("type", "image/png")

    const response = await axios({
      url: "https://graph.facebook.com/v25.0/1035262463009774/media",
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.WHATSAPP_TOKEN}`,
      },
      data
    })

    console.log({
      data: response.data,
      message: "Message sent successfully"
    })

  } catch (error) {
    console.log(error);
  }
}


sendMediaMessage()