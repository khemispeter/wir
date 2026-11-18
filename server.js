const express = require('express');
const Database = require('better-sqlite3');
const crypto = require('crypto');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'ChangeMe123'; // change before going live

const db = new Database(path.join(__dirname, 'data.db'));
db.exec(`
CREATE TABLE IF NOT EXISTS messages(
  id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL,
  phone TEXT, message TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS subscribers(
  id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP);`);

const app = express();
const tokens = new Map();
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (s, n) => String(s || '').trim().slice(0, n);
const same = (a, b) => {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};
const auth = (req, res, next) => {
  const t = (req.headers.authorization || '').replace('Bearer ', '');
  if (!(tokens.get(t) > Date.now())) return res.status(401).json({ error: 'Please log in again.' });
  next();
};

app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/contact', (req, res) => {
  const name = clean(req.body.name, 100), email = clean(req.body.email, 150),
        phone = clean(req.body.phone, 30), message = clean(req.body.message, 2000);
  if (!name || !message || !emailRe.test(email))
    return res.status(400).json({ error: 'Please enter your name, a valid email and your message.' });
  db.prepare('INSERT INTO messages(name,email,phone,message) VALUES(?,?,?,?)').run(name, email, phone, message);
  res.json({ ok: true });
});

app.post('/api/subscribe', (req, res) => {
  const email = clean(req.body.email, 150);
  if (!emailRe.test(email)) return res.status(400).json({ error: 'Please enter a valid email address.' });
  db.prepare('INSERT OR IGNORE INTO subscribers(email) VALUES(?)').run(email);
  res.json({ ok: true });
});

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body || {};
  if (same(username, ADMIN_USER) && same(password, ADMIN_PASS)) {
    const t = crypto.randomBytes(24).toString('hex');
    tokens.set(t, Date.now() + 8 * 3600 * 1000);
    return res.json({ token: t });
  }
  res.status(401).json({ error: 'Wrong username or password.' });
});

app.get('/api/admin/messages', auth, (req, res) =>
  res.json(db.prepare('SELECT * FROM messages ORDER BY id DESC').all()));
app.get('/api/admin/subscribers', auth, (req, res) =>
  res.json(db.prepare('SELECT * FROM subscribers ORDER BY id DESC').all()));
app.delete('/api/admin/messages/:id', auth, (req, res) => {
  db.prepare('DELETE FROM messages WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`Women Rise Initiatives running at http://localhost:${PORT}`));
