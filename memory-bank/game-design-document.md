# Game Design Document

> Version: 0.2  
> Last Updated: 2024-06-XX

## Table of Contents

1. [High-Level Vision](#high-level-vision)  
2. [Genre & Core Concept](#genre-core-concept)  
3. [Target Audience & Platform](#target-audience-platform)  
4. [Core Gameplay Loop](#core-gameplay-loop)  
5. [Game Mechanics](#game-mechanics)  
   - [Map & World](#map-world)  
   - [Player Representation](#player-representation)  
   - [Movement & Controls](#movement-controls)  
   - [Health, Consumption & Growth](#health-consumption-growth)  
   - [Collision & Interaction](#collision-interaction)  
6. [Multiplayer & Networking](#multiplayer-networking)  
   - [Server Architecture](#server-architecture)  
   - [Client Architecture](#client-architecture)  
   - [Synchronization & Latency](#synchronization-latency)  
7. [UI / UX](#ui-ux)  
8. [Art Direction & Audio](#art-direction-audio)  
9. [Technical Requirements & Tech Stack](#technical-requirements-tech-stack)  
10. [Milestones & Roadmap](#milestones-roadmap)  
11. [Risks & Mitigations](#risks-mitigations)  
12. [Next Steps](#next-steps)  

---

## 1. High-Level Vision

We're building a multiplayer online "snake-style" arena using simple shapes and open source assets.  
Each player spawns as a dot on a large shared map. Players navigate with arrow keys.  
Upon encountering another player, if your health is higher, you "consume" them, gaining length/health.  
Goal: Become the biggest snake in the world in a fast-paced, skill-based environment.

## 2. Genre & Core Concept

- **Genre:** MMO Casual / Arcade  
- **Gameplay Style:** Free-for-all battle royale meets classic Snake  
- **Perspective:** Top-down 2D view  
- **Session Length:** 5–15 minutes per round

## 3. Target Audience & Platform

- **Audience:** Casual gamers, ages 12+; fans of arcade and quick-session games  
- **Platform:** Web (desktop browsers) with eventual mobile support (touch controls)  
- **Accessibility:** No specific requirements beyond basic usability and color contrast.  
- **Monorepo:** Client and server code live in a single repository.

## 4. Core Gameplay Loop

1. **Join / Spawn:** Player enters lobby → spawns as a dot with base health & length.  
2. **Explore / Grow:** Navigate the map → collect pickups (health boosts, speed boosts).  
3. **Engage:** When two snakes collide, the higher-health snake consumes the other.  
4. **Progression:** Consuming gives additional health/length → raises risk/reward choices.  
5. **End Condition:** Last snake standing, timed elimination, or scoreboard snapshot.

## 5. Game Mechanics

### Map & World
- **Size:** Large, toroidal arena (edges wrap around). Size configurable (e.g., 2000×2000 units).  
- **Obstacles:** Optional static obstacles (walls, barriers) for strategy.  
- **Pickups:** Random health-oriented power-ups spawn over time.
- **Players per Room:** Each server/room supports up to ~50 concurrent players.

### Player Representation
- **Entity:** A series of connected segments (like Snake), each segment = 1 health unit.  
- **Health:** Integer = number of segments. Starting health = 10.  
- **Chat:** Single global chat for all players.

### Movement & Controls
- **Controls:** Arrow keys (or WASD) for eight-direction movement.  
- **Speed:** Base speed; slows as length increases (configurable curve).  

### Health, Consumption & Growth
- **Collision Check:**  
  - If HeadA collides with any segment of B:  
    - If HealthA > HealthB → A consumes B (gain HealthB segments), B respawns.  
    - Else no effect (or B consumes A if HealthB > HealthA).  
- **Health Cap:** Maximum health limit (e.g., 100 segments).  

### Collision & Interaction
- **Hit Detection:** Precise circle-to-circle collision per segment.  
- **Invulnerability:** Brief invincibility (1–2s) after respawn to avoid spawn kill.

## 6. Multiplayer & Networking

### Server Architecture
- **State:** Authoritative server maintains positions & health.  
- **Tick Rate:** 20–30 updates per second.  
- **Scaling:** Only a single server instance will be run initially, but the codebase should be designed for future scaling (e.g., Redis pub/sub, sharding logic).  
- **Session-Based:** No user accounts or persistent stats; all progress is session-based only.
- **Moderation:** No moderation or reporting features for now.

### Client Architecture 
- **Prediction:** Client-side interpolation/extrapolation to hide latency.  
- **Reconciliation:** Snapshots from server to correct drift.

### Synchronization & Latency
- **Protocol:** JSON or binary frames (msgpack).  
- **Compression:** Delta compression for frequent state updates.  
- **Error Handling:** Heartbeat & reconnection logic.

## 7. UI / UX

- **HUD:**  
  - Mini-map overview  
  - Health/length bar  
  - Leaderboard / scoreboard overlay  
  - Single global chat window
- **Menus:**  
  - Lobby with player list  
  - Settings (controls, audio)  
- **Feedback:**  
  - Consumptions trigger particle effects + sound cues  
  - Health pickups flash the player dot

## 8. Art Direction & Audio

- **Style:** Minimalist / flat colors for clarity at scale. Uses simple shapes and open source assets only.  
- **UI Theme:** Clean, bold typography.  
- **Audio:** Simple beeps/boops for pickups & collisions; background ambient track.

## 9. Technical Requirements & Tech Stack

- **Monorepo:** Client and server code in a single repository.
- **Self-Hosting:** All deployment and hosting will be self-managed from office/home servers.
- **CI/CD:** 100% test coverage required. CI pipeline must run lint, type-check, unit tests, E2E tests, code coverage, Docker build, and deploy to self-hosted server.
- **No Analytics/Ads:** No analytics, ads, or in-app purchases.

## 10. Milestones & Roadmap

| Milestone                       | Description                                            | ETA      |
|---------------------------------|--------------------------------------------------------|----------|
| 1. MVP Arena & Movement         | Basic map, player dots, arrow-key movement             | Week 1   |
| 2. Collision & Growth           | Health system, collision detection, consumption logic  | Week 2   |
| 3. Networking Prototype         | Server-client sync, basic lobby                        | Week 3   |
| 4. UI / Pickups / Effects       | HUD, pickups spawn, visual/audio feedback              | Week 4   |
| 5. Polish & Testing             | Latency mitigation, UI polish, automated tests         | Week 5   |
| 6. Deployment & Metrics         | Deploy to staging, analytics, stress testing           | Week 6   |

## 11. Risks & Mitigations

- **High Latency / Jitter:**  
  - Mitigation: Client prediction, server reconciliation.
- **Cheating / Spoofing:**  
  - Mitigation: Authoritative server; validate all client inputs.
- **Scale / Performance:**  
  - Mitigation: Spatial partitioning (quadtrees) for collision checks.  
  - Note: Future scaling will require Redis pub/sub and sharding logic.

---
*End of Game Design Document*  