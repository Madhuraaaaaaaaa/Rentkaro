const path = require('path');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sqlite3 = require('sqlite3').verbose();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const DB_PATH = path.join(__dirname, 'database.sqlite');

const db = new sqlite3.Database(DB_PATH);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    phone TEXT UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS browse_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    query TEXT,
    item_id TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS rentals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    item_id TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Completed','Ongoing')),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
  // Attempt to add type column if it doesn't exist
  db.run(`ALTER TABLE rentals ADD COLUMN type TEXT DEFAULT 'Rented'`, (e) => {
    // ignore error if column already exists
  });
});

const app = express();

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// Strict CORS (adjust origin as needed)
const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]);
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// JSON parsing with size limit
app.use(express.json({ limit: '100kb' }));

// Basic rate limiting for API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// POST /api/signup
app.post('/api/signup', (req, res) => {
  const { email, phone, password } = req.body || {};
  const emailOk = !email || /\S+@\S+\.\S+/.test(email);
  const phoneOk = !phone || /^\+?[\d\s\-()]{7,}$/.test(phone);
  if ((!email && !phone) || !password) return res.status(400).json({ error: 'Email or phone and password required' });
  if (!emailOk) return res.status(400).json({ error: 'Invalid email format' });
  if (!phoneOk) return res.status(400).json({ error: 'Invalid phone format' });
  if (typeof password !== 'string' || password.length < 6) return res.status(400).json({ error: 'Password too short' });

  db.get(`SELECT id FROM users WHERE email = ? OR phone = ?`, [email || null, phone || null], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (row) return res.status(409).json({ error: 'Email or phone already registered' });

    const hash = bcrypt.hashSync(password, 10);
    db.run(`INSERT INTO users (email, phone, password_hash) VALUES (?, ?, ?)`, [email || null, phone || null, hash], function (insertErr) {
      if (insertErr) return res.status(500).json({ error: 'Failed to create user' });
      const token = jwt.sign({ id: this.lastID }, JWT_SECRET, { expiresIn: '7d' });
      res.status(201).json({ token, user: { id: this.lastID, email, phone } });
    });
  });
});

// POST /api/login
app.post('/api/login', (req, res) => {
  const { email, phone, password } = req.body || {};
  const emailOk = !email || /\S+@\S+\.\S+/.test(email);
  const phoneOk = !phone || /^\+?[\d\s\-()]{7,}$/.test(phone);
  if ((!email && !phone) || !password) return res.status(400).json({ error: 'Email or phone and password required' });
  if (!emailOk) return res.status(400).json({ error: 'Invalid email format' });
  if (!phoneOk) return res.status(400).json({ error: 'Invalid phone format' });

  db.get(`SELECT * FROM users WHERE email = ? OR phone = ?`, [email || null, phone || null], (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const ok = bcrypt.compareSync(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, phone: user.phone } });
  });
});

// GET /api/history
app.get('/api/history', auth, (req, res) => {
  db.all(`SELECT id, query, item_id as itemId, created_at as createdAt FROM browse_history WHERE user_id = ? ORDER BY created_at DESC`, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ history: rows });
  });
});

// POST /api/history
app.post('/api/history', auth, (req, res) => {
  const { query, itemId } = req.body || {};
  const safeQuery = typeof query === 'string' && query.length <= 500 ? query : null;
  const safeItemId = typeof itemId === 'string' && itemId.length <= 100 ? itemId : null;
  db.run(`INSERT INTO browse_history (user_id, query, item_id) VALUES (?, ?, ?)`, [req.user.id, safeQuery, safeItemId], function (err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.status(201).json({ id: this.lastID });
  });
});

// GET /api/rentals
app.get('/api/rentals', auth, (req, res) => {
  db.all(`SELECT id, item_id as itemId, status, created_at as createdAt, type FROM rentals WHERE user_id = ? ORDER BY created_at DESC`, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ rentals: rows });
  });
});

// PATCH /api/rentals
app.patch('/api/rentals', auth, (req, res) => {
  const { id, status } = req.body || {};
  const parsedId = Number.isInteger(id) ? id : parseInt(id, 10);
  if (!parsedId || !['Completed', 'Ongoing'].includes(status)) return res.status(400).json({ error: 'Invalid payload' });
  db.run(`UPDATE rentals SET status = ? WHERE id = ? AND user_id = ?`, [status, parsedId, req.user.id], function (err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (this.changes === 0) return res.status(404).json({ error: 'Rental not found' });
    res.json({ ok: true });
  });
});

// POST /api/rentals (create)
app.post('/api/rentals', auth, (req, res) => {
  const { itemId, type } = req.body || {};
  const safeItemId = typeof itemId === 'string' && itemId.length <= 100 ? itemId : null;
  const safeType = type === 'Rented' || type === 'Lent' ? type : 'Rented';
  if (!safeItemId) return res.status(400).json({ error: 'Invalid itemId' });
  db.run(`INSERT INTO rentals (user_id, item_id, status, type) VALUES (?, ?, 'Ongoing', ?)`, [req.user.id, safeItemId, safeType], function (err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.status(201).json({ id: this.lastID });
  });
});

// POST /api/pay (mock payment)
app.post('/api/pay', auth, (req, res) => {
  const { amount } = req.body || {};
  if (typeof amount !== 'number' || !(amount > 0)) return res.status(400).json({ error: 'Invalid amount' });
  res.status(200).json({ ok: true, paymentId: `pay_${Date.now()}` });
});

// Basic health endpoint (no auth)
app.get('/healthz', (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));


