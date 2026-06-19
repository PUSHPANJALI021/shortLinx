# ShortLinx 🔗

> A production-ready URL shortener built with Node.js, Express, Redis, and PostgreSQL.

ShortLinx lets you convert long URLs into clean, shareable short links — with built-in analytics, JWT auth, Redis caching, and rate limiting baked in from day one.

---



## Features

**URL Shortening**
- Convert long URLs into short, shareable links via NanoID-generated codes
- Fast redirects with Redis cache-first lookup

**Analytics**
- Track click counts per short code
- View usage stats and link performance via API

**Security**
- JWT-based authentication
- Password hashing with bcrypt
- Helmet middleware for HTTP header hardening
- CORS protection

**Performance**
- Redis caching for sub-millisecond redirects
- Rate limiting to prevent API abuse

**Scalability**
- MVC architecture with clean separation of concerns
- Environment-based config
- Docker-ready structure

---



## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | PostgreSQL / SQLite |
| Cache | Redis |
| Auth | JWT + bcryptjs |
| Security | Helmet, express-rate-limit |
| ID Generation | NanoID |
| Config | dotenv |

---




## Project Structure

```
shortLinx/
├── src/
│   ├── routes/          # API route definitions
│   ├── controllers/     # Request handlers & business logic
│   ├── middleware/       # Auth, rate limiting, error handling
│   ├── config/
│   │   ├── db.js        # PostgreSQL/SQLite connection
│   │   └── redis.js     # Redis client setup
│   ├── utils/           # Helper functions (NanoID, etc.)
│   └── index.js         # App entry point
├── .env
├── .gitignore
├── package.json
└── README.md
```




---

## Getting Started

### Prerequisites

- Node.js v18+
- Redis (local or cloud)
- PostgreSQL or SQLite

### Installation

```bash
git clone https://github.com/PUSHPANJALI021/shortLinx.git
cd shortLinx
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
PORT=5000
JWT_SECRET=your_secret_key
DATABASE_URL=your_database_url
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Running the Server

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

Server runs at `http://localhost:5000`

---

## API Reference

### `POST /api/shorten`
Shorten a long URL.

**Request**
```json
{
  "url": "https://example.com/some/very/long/path"
}
```

**Response**
```json
{
  "shortUrl": "http://localhost:5000/abc123"
}
```

---

### `GET /:shortCode`
Redirect to the original URL.

Resolves the short code → checks Redis cache → falls back to DB → redirects.

---

### `GET /api/analytics/:shortCode`
Get click stats for a short link.

**Response**
```json
{
  "shortCode": "abc123",
  "originalUrl": "https://example.com/...",
  "clicks": 42,
  "createdAt": "2026-06-01T10:00:00Z"
}
```

---

## Future Features

- Custom aliases for branded short links
- QR code generation per short URL
- Link expiry / TTL support
- User dashboard for managing all links
- Geographic analytics (country-level click tracking)
- Device & browser breakdown
- Docker + Nginx deployment
- CI/CD pipeline integration

  


  <img width="616" height="287" alt="image" src="https://github.com/user-attachments/assets/967bae1b-cdd5-4c8e-a388-e601c08c6cef" />















