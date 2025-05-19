const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const port = 5000;

const pool = new Pool({
  user: 'user',
  host: 'db',
  database: 'books',
  password: 'pass',
  port: 5432,
});

app.use(cors());
app.use(express.json());

app.get('/api/books', async (req, res) => {
  const result = await pool.query('SELECT * FROM books');
  res.json(result.rows);
});

app.post('/api/books', async (req, res) => {
  const { title, author } = req.body;
  await pool.query('INSERT INTO books (title, author) VALUES ($1, $2)', [title, author]);
  res.sendStatus(201);
});

app.listen(port, () => console.log(`Backend running on port ${port}`));

