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
export AI_API_KEY=gsk_your-key-here
```

> **Where to get the key:** In the [Groq console](https://console.groq.com/keys) the field is named **"API Key"** — create a key there and copy the `gsk_...` value. That value is what goes into the `AI_API_KEY` environment variable above (the env var name is a project convention; the console itself does not use the name `AI_API_KEY`).
>
> **Model default:** `openai/gpt-oss-120b` (Groq's recommended replacement for the now-deprecated `llama-3.3-70b-versatile`, which was shut down 08/16/2026 — calls with the old model id returned errors and silently fell back to heuristics, showing **0 tokens used** in the Groq console). Override with `AI_MODEL` if needed.
>
> Without a key the app still works: analysis falls back to the built-in deterministic ATS engine and cover letters use the offline template generator, so uploads never hard-fail. To tell which engine produced a result, check the `source` field in the API response (`"groq"` vs `"heuristic"`) — the UI shows a badge for it.
>
> **Diagnose "0 tokens used":** hit `GET https://<backend>/api/v1/ai/status` (public, no auth). If it returns `{"configured": false}`, the `AI_API_KEY`/`GROQ_API_KEY` environment variable is missing or is still the placeholder on the backend host — set it and redeploy.

---

## Deploying the Backend (Render)

Set these environment variables on the Render service (names are **exact** — the Groq key must be named `AI_API_KEY`, not anything else):

| Variable | Value |
| -------- | ----- |
| `AI_API_KEY` | Your Groq key: `gsk_...` (create it at console.groq.com/keys — the console calls it "API Key"). `GROQ_API_KEY` is also accepted as a fallback name, so either works |
| `JWT_SECRET` | A random string of 64+ characters |
| `SPRING_DATASOURCE_URL` | A managed Postgres JDBC URL (e.g. Render Postgres) — **required in production**; the default H2 file DB resets on every deploy |
| `SPRING_PROFILES_ACTIVE` | `prod` |

Optional:

| Variable | Value |
| -------- | ----- |
| `AI_MODEL` | Groq model id (default `openai/gpt-oss-120b`) |
| `AI_BASE_URL` | OpenAI-compatible base URL **without `/v1`** (default `https://api.groq.com/openai`; for OpenRouter use `https://openrouter.ai/api`) |
| `KEEP_ALIVE_URLS` | Comma-separated URLs the backend pings every 4 minutes (default: the Vercel frontend + the backend's own `/health`). Add your Render URL if it differs |
| `KEEP_ALIVE_ENABLED` | `true`/`false` (default `true`) |
| `KEEP_ALIVE_INTERVAL_MS` | Ping interval in ms (default `240000` = 4 min) |

Then configure the service:
- **Build command:** `cd backend && ./mvnw -DskipTests package`
- **Start command:** `java -jar target/*.jar`
- **Health check path:** `/health` (returns HTTP 200 — the app has no Actuator, and the old `/` 404 breaks Render's health check). `/health` is now public, so health checks and uptime monitors no longer get 401.

The AI call goes to `{AI_BASE_URL}/v1/chat/completions` (default `https://api.groq.com/openai/v1/chat/completions`) with the `AI_API_KEY` value, so `AI_BASE_URL` is only needed if you point it at another OpenAI-compatible provider.

## Keeping the backend awake (free-tier sleep)

Render free (and most free hosts) spin the instance down after **~15 minutes of inactivity**; the next request cold-starts so slowly that the frontend's HTTP call times out, which looks like "the app is sleeping / cover letter isn't generated".

- The deployed frontend on Vercel is **static — it never sleeps**, so pinging it (UptimeRobot on the Vercel URL) does nothing for the backend. The monitor must hit the **backend**: point UptimeRobot (free tier, 5-min interval) at `https://<your-backend>.onrender.com/health` — that alone keeps the free instance awake, since 5 min < 15 min idle timeout.
- The backend also runs a built-in keep-alive scheduler (`KeepAliveService`) that pings `KEEP_ALIVE_URLS` every 4 minutes. This covers the frontend + backend URLs while the JVM is running, and is the right mechanism on always-on hosts (paid plans, Docker, VPS). It cannot fire while a fully-suspended free instance is down, so pair it with the UptimeRobot check above.

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
