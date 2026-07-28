# PROJ — AI-Powered Resume Processing Platform

🚀 **[Live Demo: https://proj-resume-intelligence.vercel.app/](https://proj-resume-intelligence.vercel.app/)**

A modular monolith platform that uses AI (via Groq/OpenRouter) to process and analyze resumes, built with Spring Boot and React.

---

## Prerequisites

| Tool             | Version  | Purpose                        |
| ---------------- | -------- | ------------------------------ |
| **Java**         | 17+      | Backend runtime                |
| **Maven**        | 3.9+     | Backend build tool             |
| **Node.js**      | 18+      | Frontend runtime               |
| **npm**          | 9+       | Frontend package manager       |
| **Docker**       | 24+      | Container runtime              |
| **Docker Compose** | 2.x    | Multi-container orchestration  |

---

## Quick Start

### 1. Start Infrastructure Services

```bash
docker compose up -d
```

This launches:
- **PostgreSQL 15** on `localhost:5432` (user: `proj_user`, password: `proj_pass`, database: `proj_db`)
- **RabbitMQ** on `localhost:5672` (AMQP) and `localhost:15672` (Management UI — user: `guest`, password: `guest`)

Verify services are healthy:

```bash
docker compose ps
```

### 2. Start the Backend

```bash
cd backend
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080`.

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The development server will be available at `http://localhost:5173`.

---

## Project Structure

```
PROJ/
├── backend/            # Spring Boot Maven project
├── frontend/           # React + Vite frontend
├── docker-compose.yml  # PostgreSQL & RabbitMQ
├── README.md           # This file
└── ARCHITECTURE.md     # Architectural overview
```

---

## Configuration

### AI Provider (Groq / OpenRouter)

The backend uses Spring AI's OpenAI-compatible client. Configure your provider in `backend/src/main/resources/application.yml`:

```yaml
spring:
  ai:
    openai:
      api-key: ${AI_API_KEY}
      base-url: https://api.groq.com/openai/v1   # or https://openrouter.ai/api/v1
```

Set the API key as an environment variable:

```bash
export AI_API_KEY=your-api-key-here
```

---

## Useful Links

| Service              | URL                          |
| -------------------- | ---------------------------- |
| Backend API          | http://localhost:8080         |
| Frontend Dev Server  | http://localhost:5173         |
| RabbitMQ Management  | http://localhost:15672        |

---

## License

Private — All rights reserved.
