# LLM tools

A self hosted web app for building workflows and tools around LLMs.

## Features

- Simple LLM chat with threads
- Configurable Agents (system prompt, model)
- OpenAI model selection [options here](src/modules/llm/constants.ts)
- Web Push notifications via service worker and `web-push` library
- (incomplete) Basic background worker & queue for scheduling actions

## Tech Stack

- Next.js app router
- Prisma ORM
- SQLite
- Clerk for authentication
- Redis & BullMQ for background tasks
- Cloudflare Tunnel & Docker for self-hosting

## Getting Started

### Prerequisites

1. Clone the repo
1. Setup external dependencies
1. Copy `.env.example` to `.env` and fill in the values

### Development

1. Run `npm install` to install dependencies
1. Run `npm run db:push` to create the database
1. Run `npm run dev` to start the app services in development mode

### Self-hosting

1. Run `docker-compose up` to start the app services and the Cloudflare Tunnel
