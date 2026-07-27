# Architecture Overview

## System Architecture

PROJ is a **modular monolith** built with Spring Boot, using event-driven messaging via RabbitMQ for asynchronous resume processing and AI-powered analysis via Groq/OpenRouter.

---

## High-Level Diagram

```
┌──────────────┐       ┌──────────────────────────────────────────┐
│   React UI   │◄─────►│            Spring Boot API               │
│  (Vite/TS)   │ REST  │                                          │
└──────────────┘       │  ┌──────────┐  ┌──────────┐  ┌────────┐ │
                       │  │  Resume   │  │   Auth   │  │   AI   │ │
                       │  │  Module   │  │  Module  │  │ Module │ │
                       │  └────┬─────┘  └──────────┘  └───┬────┘ │
                       │       │                           │      │
                       │       ▼                           ▼      │
                       │  ┌─────────┐              ┌───────────┐  │
                       │  │RabbitMQ │              │Groq/Open- │  │
                       │  │ Events  │              │  Router    │  │
                       │  └─────────┘              └───────────┘  │
                       │       │                                  │
                       │       ▼                                  │
                       │  ┌──────────┐                            │
                       │  │PostgreSQL│                            │
                       │  └──────────┘                            │
                       └──────────────────────────────────────────┘
```

---

## Backend Package Structure

```
com.proj
├── resume/                 # Resume upload, parsing, storage
│   ├── controller/         # REST endpoints
│   ├── service/            # Business logic
│   ├── repository/         # JPA repositories
│   ├── model/              # JPA entities
│   ├── dto/                # Data transfer objects
│   └── event/              # RabbitMQ producers & consumers
│
├── auth/                   # Authentication & authorization
│   ├── controller/
│   ├── service/
│   ├── model/
│   └── config/
│
├── ai/                     # AI analysis integration
│   ├── service/            # Spring AI client wrappers
│   ├── dto/                # AI prompt/response DTOs
│   └── config/             # AI provider configuration
│
├── shared/                 # Cross-cutting concerns
│   ├── config/             # Global configs (CORS, Security, AMQP)
│   ├── exception/          # Global exception handlers
│   └── util/               # Utility classes
│
└── ProjApplication.java    # Main entry point
```

---

## Data Models

### Core Entities

| Entity      | Description                                   |
| ----------- | --------------------------------------------- |
| `User`      | Registered user with role-based access         |
| `Resume`    | Uploaded resume metadata and file reference    |
| `Analysis`  | AI-generated analysis results for a resume     |

### Entity Relationships

```
User (1) ──── (N) Resume (1) ──── (N) Analysis
```

---

## Event-Driven Processing Flow

Resume processing is asynchronous, using RabbitMQ to decouple upload from AI analysis.

### Message Flow

```
1. User uploads resume via REST API
        │
        ▼
2. ResumeService saves metadata to PostgreSQL
   and publishes RESUME_UPLOADED event
        │
        ▼
3. RabbitMQ routes event to AI processing queue
        │
        ▼
4. AIConsumer receives event, calls Groq/OpenRouter
   for analysis via Spring AI OpenAI client
        │
        ▼
5. Analysis results saved to PostgreSQL
   and ANALYSIS_COMPLETE event published
        │
        ▼
6. Frontend polls or receives notification
   of completed analysis
```

### RabbitMQ Topology

| Exchange          | Type   | Routing Key          | Queue                  |
| ----------------- | ------ | -------------------- | ---------------------- |
| `resume.exchange` | Topic  | `resume.uploaded`    | `resume.process.queue` |
| `resume.exchange` | Topic  | `analysis.complete`  | `analysis.notify.queue`|

---

## Technology Stack

| Layer          | Technology                        |
| -------------- | --------------------------------- |
| Frontend       | React, Vite, TypeScript, Tailwind |
| Backend        | Spring Boot 3.x, Java 17         |
| Database       | PostgreSQL 15                     |
| Messaging      | RabbitMQ 3.x                      |
| AI Provider    | Groq / OpenRouter (OpenAI API)    |
| ORM            | Hibernate / Spring Data JPA       |
| Migrations     | Flyway                            |
| Auth           | Spring Security                   |

---

## API Design

All REST endpoints follow this convention:

```
/api/v1/{module}/{resource}
```

Examples:
- `POST /api/v1/resumes/upload`
- `GET  /api/v1/resumes/{id}`
- `GET  /api/v1/resumes/{id}/analysis`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register`
