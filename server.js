// Bonna Mailing Dashboard - server with Postgres-backed shared notes
const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '1mb' }));

// ----- Postgres -----
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    })
  : null;

async function initDb() {
  if (!pool) {
    console.warn('[bonna] No DATABASE_URL set - notes API will return 503.');
    return;
  }
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notes (
        mailing_id TEXT PRIMARY KEY,
        content    TEXT NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    console.log('[bonna] notes table ready.');
  } catch (e) {
    console.error('[bonna] DB init failed:', e.message);
  }
}

// ----- API -----
app.get('/api/health', (_req, res) => res.json({ ok: true, db: !!pool }));

app.get('/api/notes', async (_req, res) => {
  if (!pool) return res.status(503).json({ error: 'no-db' });
  try {
    const { rows } = await pool.query('SELECT mailing_id, content FROM notes');
    const data = {};
    rows.forEach((r) => { data[r.mailing_id] = r.content; });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/notes', async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'no-db' });
  try {
    const { mailing_id, content } = req.body || {};
    if (!mailing_id || typeof mailing_id !== 'string' || mailing_id.length > 50) {
      return res.status(400).json({ error: 'invalid-mailing-id' });
    }
    if (typeof content !== 'string' || content.length > 50000) {
      return res.status(400).json({ error: 'invalid-content' });
    }
    await pool.query(
      `INSERT INTO notes (mailing_id, content, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (mailing_id) DO UPDATE
       SET content = EXCLUDED.content, updated_at = NOW();`,
      [mailing_id, content]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/notes/clear', async (_req, res) => {
  if (!pool) return res.status(503).json({ error: 'no-db' });
  try {
    await pool.query('DELETE FROM notes');
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ----- Static -----
app.get('/', (_req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.use(express.static(__dirname, { maxAge: '5m', index: false }));

initDb().then(() => {
  app.listen(PORT, () => console.log(`[bonna] running on port ${PORT}`));
});
