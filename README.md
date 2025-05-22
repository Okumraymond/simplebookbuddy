# SimpleBookBuddy

SimpleBookBuddy is a basic 3-tier Dockerized full-stack web application that allows users to manage a collection of books. It includes a React frontend, Node.js/Express backend, and PostgreSQL database, all orchestrated using Docker Compose and hosted on an AWS EC2 instance.

---

## Features

* View all books
* Add new books
* Backend API powered by Node.js and PostgreSQL
* Dockerized setup with isolated containers for frontend, backend, and database

---

## Prerequisites

* [Docker](https://www.docker.com/products/docker-desktop)
* [Docker Compose](https://docs.docker.com/compose/install/)
* AWS EC2 instance (Amazon Linux preferred)
* Ports 3000 and 5000 open in your AWS security group

---

## Folder Structure

```
simplebookbuddy/
├── backend/
│   ├── Dockerfile
│   └── index.js
├── frontend/
│   ├── Dockerfile
│   └── (React app files)
├── docker-compose.yml
└── README.md
```

---

## PostgreSQL Configuration

The PostgreSQL service is configured with the following credentials:

* **User**: `user`
* **Password**: `pass`
* **Database**: `books`

Ensure these match across `docker-compose.yml` and backend environment variables.

---

## Backend Code (Node.js)

**backend/index.js**

```js
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
```

---

## docker-compose.yml

```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DB_HOST=db
      - DB_USER=user
      - DB_PASSWORD=pass
      - DB_NAME=books
    depends_on:
      - db

  db:
    image: postgres:14
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: books
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

---


### 📅 Dockerfiles

#### Backend Dockerfile (`backend/Dockerfile`):

```Dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "index.js"]
```

#### Frontend Dockerfile (`frontend/Dockerfile`):

```Dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```



## Troubleshooting

### Error: `relation "books" does not exist`

This error means the `books` table hasn't been created. Manually create the table in the running PostgreSQL container:

```bash
docker exec -it simplebookbuddy-db-1 psql -U user -d books
```

Then run:

```sql
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  author VARCHAR(255)
);
```

### Docker Container Issues

If containers are not running or restarting:

```bash
docker-compose down -v
docker-compose up --build
```

If `pgdata` volume causes error:
Make sure it is defined in `volumes:` at the bottom of `docker-compose.yml`.

---

## Accessing the App

Make sure your EC2 instance allows inbound traffic on ports **3000** and **5000**.

Then, access the app via:

* Frontend: `http://<YOUR_PUBLIC_IP>:3000`
* Backend API: `http://<YOUR_PUBLIC_IP>:5000/api/books`

If using React, ensure API calls use the public IP (not `localhost`). Update `.env` in React frontend:

```env
REACT_APP_API_URL=http://<YOUR_PUBLIC_IP>:5000
```

Rebuild frontend:

```bash
docker-compose up --build frontend
```

---

##  Notes

Make sure PostgreSQL roles, permissions, and your frontend environment match correctly. For persistent debugging, use `docker logs <container_name>`.

I enjoyed running this task.
