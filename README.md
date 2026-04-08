# WhatsApp integration (Node.js)

A small playground for learning how to integrate with **WhatsApp** through Meta’s **Cloud API**: sending messages, templates, media, and related calls from Node.js.

The goal is to get comfortable with the API end-to-end and to understand how WhatsApp can fit into broader workflows—including **AI-assisted** or automated messaging—without treating this repo as production-ready infrastructure.

## Setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and set `WHATSAPP_TOKEN` to a valid token from your Meta app (never commit `.env`).
3. Run the scripts you use in `index.js` (for example: `node index.js`).

## Notes

- Keep tokens and phone numbers out of git; rotate anything that was ever shared or committed by mistake.
