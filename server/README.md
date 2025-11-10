# Religion backend

This folder contains a minimal Express backend used by the static site. It exposes a contact API at:

- POST /api/contact  — accepts JSON body { name, email, message }
- GET  /api/messages — returns stored messages (for testing/admin)

Quick start (locally):

1. cd server
2. npm install
3. npm run dev   # requires nodemon (dev) or npm start

Notes:
- Messages are stored in `server/data/messages.json`.
- For production deploy, use environment variable `PORT`.
