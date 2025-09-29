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
    payment_id TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
  // Attempt to add type column if it doesn't exist
  db.run(`ALTER TABLE rentals ADD COLUMN type TEXT DEFAULT 'Rented'`, (e) => {
    // ignore error if column already exists
  });
  // Attempt to add payment_id column if it doesn't exist
  db.run(`ALTER TABLE rentals ADD COLUMN payment_id TEXT`, (e) => {
    // ignore error if column already exists
  });

  // Items table
  db.run(`CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    image TEXT,
    price_per_day REAL NOT NULL,
    category TEXT,
    available_dates TEXT,
    owner_contact TEXT,
    owner_address TEXT,
    description TEXT,
    rating REAL DEFAULT 5.0,
    owner_id INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);
});

const app = express();

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS
const isDev = process.env.NODE_ENV !== 'production';
const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
]);
app.use(cors({
  origin(origin, callback) {
    if (isDev) return callback(null, true);
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
    if (err) { console.error('DB error on SELECT history', err); return res.status(500).json({ error: 'Database error' }); }
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
    if (err) { console.error('DB error on INSERT history', err); return res.status(500).json({ error: 'Database error' }); }
    res.status(201).json({ id: this.lastID });
  });
});

// GET /api/rentals
app.get('/api/rentals', auth, (req, res) => {
  db.all(`SELECT id, item_id as itemId, status, created_at as createdAt, type, payment_id as paymentId FROM rentals WHERE user_id = ? ORDER BY created_at DESC`, [req.user.id], (err, rows) => {
    if (err) { console.error('DB error on SELECT rentals', err); return res.status(500).json({ error: 'Database error' }); }
    res.json({ rentals: rows });
  });
});

// GET /api/rentals/:id
app.get('/api/rentals/:id', auth, (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({ error: 'Invalid id' });
  db.get(`SELECT id, item_id as itemId, status, created_at as createdAt, type, payment_id as paymentId FROM rentals WHERE id = ? AND user_id = ?`, [id, req.user.id], (err, row) => {
    if (err) { console.error('DB error on SELECT rental by id', err); return res.status(500).json({ error: 'Database error' }); }
    if (!row) return res.status(404).json({ error: 'Rental not found' });
    res.json({ rental: row });
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
  const { itemId, type, paymentId } = req.body || {};
  const safeItemId = typeof itemId === 'string' && itemId.length <= 100 ? itemId : null;
  const safeType = type === 'Rented' || type === 'Lent' ? type : 'Rented';
  if (!safeItemId) return res.status(400).json({ error: 'Invalid itemId' });
  db.run(`INSERT INTO rentals (user_id, item_id, status, type, payment_id) VALUES (?, ?, 'Ongoing', ?, ?)`, [req.user.id, safeItemId, safeType, paymentId || null], function (err) {
    if (err) { console.error('DB error on INSERT rental', err); return res.status(500).json({ error: 'Database error' }); }
    res.status(201).json({ id: this.lastID });
  });
});

// POST /api/pay (mock payment)
app.post('/api/pay', auth, (req, res) => {
  const { amount } = req.body || {};
  if (typeof amount !== 'number' || !(amount > 0)) return res.status(400).json({ error: 'Invalid amount' });
  res.status(200).json({ ok: true, paymentId: `pay_${Date.now()}` });
});

// Items APIs
// GET /api/items
app.get('/api/items', (req, res) => {
  db.all(`SELECT id, name, image, price_per_day as pricePerDay, category, available_dates as availableDates, owner_contact as ownerContact, owner_address as ownerAddress, description, rating FROM items ORDER BY created_at DESC`, [], (err, rows) => {
    if (err) { console.error('DB error on SELECT items', err); return res.status(500).json({ error: 'Database error' }); }
    res.json({ items: rows });
  });
});

// GET /api/items/:id
app.get('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({ error: 'Invalid id' });
  db.get(`SELECT id, name, image, price_per_day as pricePerDay, category, available_dates as availableDates, owner_contact as ownerContact, owner_address as ownerAddress, description, rating FROM items WHERE id = ?`, [id], (err, row) => {
    if (err) { console.error('DB error on SELECT item by id', err); return res.status(500).json({ error: 'Database error' }); }
    if (!row) return res.status(404).json({ error: 'Item not found' });
    res.json({ item: row });
  });
});

// POST /api/items (auth)
app.post('/api/items', auth, (req, res) => {
  const { name, image, pricePerDay, category, availableDates, ownerContact, ownerAddress, description } = req.body || {};
  if (!name || typeof pricePerDay !== 'number') return res.status(400).json({ error: 'Name and pricePerDay required' });
  db.run(
    `INSERT INTO items (name, image, price_per_day, category, available_dates, owner_contact, owner_address, description, owner_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, image || null, pricePerDay, category || null, availableDates || null, ownerContact || null, ownerAddress || null, description || null, req.user.id],
    function (err) {
      if (err) { console.error('DB error on INSERT item', err); return res.status(500).json({ error: 'Database error' }); }
      res.status(201).json({ id: this.lastID });
    }
  );
});

// PATCH /api/items/:id (auth, owner)
app.patch('/api/items/:id', auth, (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({ error: 'Invalid id' });
  const fields = ['name','image','pricePerDay','category','availableDates','ownerContact','ownerAddress','description'];
  const updates = [];
  const values = [];
  for (const f of fields) {
    if (req.body && Object.prototype.hasOwnProperty.call(req.body, f)) {
      const column = f === 'pricePerDay' ? 'price_per_day' : f.replace(/[A-Z]/g, m => `_${m.toLowerCase()}`);
      updates.push(`${column} = ?`);
      values.push(req.body[f]);
    }
  }
  if (!updates.length) return res.status(400).json({ error: 'No fields to update' });
  values.push(id, req.user.id);
  db.run(`UPDATE items SET ${updates.join(', ')} WHERE id = ? AND owner_id = ?`, values, function (err) {
    if (err) { console.error('DB error on UPDATE item', err); return res.status(500).json({ error: 'Database error' }); }
    if (this.changes === 0) return res.status(404).json({ error: 'Item not found or not owned' });
    res.json({ ok: true });
  });
});

// DELETE /api/items/:id (auth, owner)
app.delete('/api/items/:id', auth, (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({ error: 'Invalid id' });
  db.run(`DELETE FROM items WHERE id = ? AND owner_id = ?`, [id, req.user.id], function (err) {
    if (err) { console.error('DB error on DELETE item', err); return res.status(500).json({ error: 'Database error' }); }
    if (this.changes === 0) return res.status(404).json({ error: 'Item not found or not owned' });
    res.json({ ok: true });
  });
});

// Basic health endpoint (no auth)
app.get('/healthz', (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));


