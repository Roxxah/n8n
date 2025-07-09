const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(express.json());

// Verbindung zur Datenbank
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Neue Analyse speichern
app.post('/api/analysen', async (req, res) => {
  const { symbol, analyse, zeit } = req.body;
  if (!symbol || !analyse || !zeit) {
    return res.status(400).json({ error: 'Fehlende Felder' });
  }

  try {
    await pool.query(
      'INSERT INTO analysen (symbol, analyse, zeit) VALUES ($1, $2, $3)',
      [symbol, analyse, zeit]
    );
    res.status(200).json({ status: 'Erfolg' });
  } catch (err) {
  console.error('Fehler bei DB-Abfrage:', err);
  res.status(500).json({ error: 'DB-Fehler', details: err.message });
}

});

// Analysen abrufen
app.get('/api/analysen', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'DB erreichbar', time: result.rows[0].now });
  } catch (err) {
    console.error('DB-Verbindungsfehler:', err.message);
    res.status(500).json({ error: 'DB-Verbindungsfehler', details: err.message });
  }
});


// Server starten
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
