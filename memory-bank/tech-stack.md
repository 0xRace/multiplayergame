# Tech Stack Recommendation

A minimal but solid stack to get our MMO snake arena up and running quickly, while remaining maintainable and scalable.

---

## Project Constraints & Notes
- All visuals and audio use simple shapes and open source assets.
- Each server/room supports up to ~50 concurrent players.
- Only a single server instance will be run initially, but the codebase should be designed for future scaling (e.g., Redis pub/sub, stateless logic).
- The game is session-based only; no user accounts or persistent stats.
- Monorepo structure: client and server code live in the same repository.
- No accessibility requirements beyond basic usability.
- No ads, in-app purchases, or analytics/tracking.
- There will be a single global chat for all players.
- No moderation or reporting features for now.
- 100% test coverage is required for all code.
- All deployment and hosting will be self-managed from office/home servers.

---

## 1. Language & Tooling
- **TypeScript** (both client & server)
- **Vite** for fast dev server & bundling

## 2. Client
- **Phaser 3**  
  - Lightweight 2D game engine with built-in physics and asset handling
- **HTML5 Canvas API** (via Phaser)
- **TypeScript** for type safety
- **Vite** for module bundling & hot reload

## 3. Server
- **Node.js** (LTS)
- **Express.js** or **Fastify** (minimal HTTP + WebSocket upgrade)
- **Socket.IO**  
  - Easy real-time bi-directional communication  
- **TypeScript**

## 4. Data & Persistence
- **In-memory state** for real-time positions & health
- **Redis** (optional, for future scaling)  
  - Pub/sub for scaling across multiple server instances  
  - Persistent leaderboard storage (future)

## 5. DevOps & Deployment
- **Docker**  
  - Containerize client & server for consistent environments
- **GitHub Actions**  
  - CI: lint, build, test, code coverage (100%)
  - CD: deploy to self-hosted server
- **Hosting**  
  - Self-hosted (office/home server)

## 6. Testing & Monitoring
- **Jest** for unit & integration tests
- **Playwright** or **Cypress** for end-to-end tests

---

## CI Pipeline Requirements
- Lint all code (client and server)
- Type-check all TypeScript code
- Run all unit tests (Jest) and ensure 100% code coverage
- Run all end-to-end tests (Playwright or Cypress)
- Build Docker images for client and server
- Deploy to self-hosted server (manual or automated step)

---

This stack strikes a balance between simplicity, strong TypeScript typing, and the ability to scale as our player base grows. All features and infrastructure are designed for self-hosting and open source compliance.
