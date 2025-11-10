const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Optional: serve the static site (if you want the backend to serve the frontend)
// app.use(express.static(path.join(__dirname, '..')));

const DATA_DIR = path.join(__dirname, 'data');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(MESSAGES_FILE)) fs.writeFileSync(MESSAGES_FILE, '[]', 'utf8');
}

ensureDataFile();

// POST /api/contact - receive contact form submissions
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email and message are required' });
  }

  try {
    const raw = fs.readFileSync(MESSAGES_FILE, 'utf8');
    const messages = JSON.parse(raw || '[]');
    const entry = {
      id: Date.now(),
      name,
      email,
      message,
      receivedAt: new Date().toISOString()
    };
    messages.push(entry);
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf8');
    return res.status(201).json({ ok: true, entry });
  } catch (err) {
    console.error('Failed to save message', err);
    return res.status(500).json({ error: 'failed to save message' });
  }
});

// GET /api/messages - list received messages (useful for testing)
app.get('/api/messages', (req, res) => {
  try {
    const raw = fs.readFileSync(MESSAGES_FILE, 'utf8');
    const messages = JSON.parse(raw || '[]');
    res.json(messages);
  } catch (err) {
    console.error('Failed to read messages', err);
    res.status(500).json({ error: 'failed to read messages' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
