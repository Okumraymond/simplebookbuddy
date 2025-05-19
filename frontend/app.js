import React, { useState, useEffect } from 'react';

function App() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title: '', author: '' });

  useEffect(() => {
    fetch('/api/books')
      .then(res => res.json())
      .then(setBooks);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    }).then(() => {
      setForm({ title: '', author: '' });
      fetch('/api/books').then(res => res.json()).then(setBooks);
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>📚 BookBuddy</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />
        <input
          placeholder="Author"
          value={form.author}
          onChange={e => setForm({ ...form, author: e.target.value })}
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {books.map((b, i) => (
          <li key={i}>{b.title} by {b.author}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

