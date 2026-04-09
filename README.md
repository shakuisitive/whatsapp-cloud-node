# WhatsApp Cloud API — Node.js playground

Personal learning project: use the **WhatsApp Business Platform (Cloud API)** in isolation to understand how messaging, webhooks, and Meta’s Graph API fit together—**not** production infrastructure.

## What we explored

| Topic | What we tried |
|--------|----------------|
| **Graph API** | `POST /v{version}/{phone-number-id}/messages` with a **Bearer token** |
| **Outbound text** | Plain text messages (`type: "text"`) |
| **Templates** | Approved templates (e.g. `hello_world`) — `index.js` |
| **Reply with context** | `context.message_id` so the reply appears **in-thread** in WhatsApp |
| **Interactive — list** | `type: "interactive"` + `interactive.type: "list"` (sections, rows, button text limits) |
| **Interactive — buttons** | `type: "interactive"` + `interactive.type: "button"` (reply buttons) |
| **Inbound handling** | Parse webhook `entry` → `changes` → `value.messages` vs `value.statuses` |
| **List / button replies** | `messages.type: "interactive"` with `list_reply` / `button_reply` |
| **Webhooks — verify** | `GET /webhook`: `hub.mode`, `hub.verify_token`, `hub.challenge` → echo challenge as **plain text** |
| **Webhooks — events** | `POST /webhook`: JSON body from Meta; always respond **200** quickly when possible |
| **Status vs messages** | `statuses` = delivery/read updates; don’t treat them like new user text (avoids reply loops) |
| **Media** | Send image by **media id**; upload file via `multipart/form-data` to `.../media` — `index.js` |
| **ngrok** | Public **HTTPS** URL → `localhost` for Meta’s callback URL (free tier URL changes on restart) |
| **Env & secrets** | `WHATSAPP_TOKEN`, `WEBHOOK_VERIFY_TOKEN`, optional `PHONE_NUMBER_ID`, `PORT` |

## Repo layout

- **`server.js`** — Express app: `/`, `GET/POST /webhook`, sends/replies, list & button messages, handles interactive replies.
- **`index.js`** — One-off experiments: templates, text, media send, media upload (call functions manually as needed).
- **`.env.example`** — Variable names to copy into `.env`.

## Setup

1. `npm install`
2. Copy `.env.example` → `.env` and fill in:
   - `WHATSAPP_TOKEN` — System User / access token from Meta
   - `WEBHOOK_VERIFY_TOKEN` — same string as in the App Dashboard **Verify token**
   - `PHONE_NUMBER_ID` — Phone Number ID used in the Graph URL (optional; defaults in code if unset)
3. Run the server: `npm start` → listens on `PORT` or **3000**.

## Webhook + ngrok (short)

1. Start the app: `npm start`
2. In another terminal: `ngrok http 3000` (or your `PORT`)
3. In Meta: set **Callback URL** to `https://<your-ngrok-host>/webhook`, same **Verify token** as `WEBHOOK_VERIFY_TOKEN`
4. Subscribe to **`messages`** (and any other fields you need)

## Chat commands (this demo)

With the server running, message your WhatsApp Business number:

- **`hello`** — text reply (with reply context)
- **`list`** — interactive list message
- **`buttons`** — interactive reply buttons  
Tapping a list row or button triggers a follow-up text that echoes the chosen **id** / **title**.

## Security

- **Never commit `.env`** or live tokens.
- Rotate tokens if they were pasted into chats, logs, or screenshots.
- Prefer env vars over hardcoding phone numbers and IDs in source (adjust `index.js` if you fork this).

## References

- [WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Webhooks — verification](https://developers.facebook.com/docs/graph-api/webhooks/getting-started)
