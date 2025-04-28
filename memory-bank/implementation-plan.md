# Implementation Plan

This document breaks down development into small, verifiable steps. Each step includes a concrete test to confirm correct implementation.

---

## Project Assumptions & Constraints

- The game uses simple shapes and open source assets for all visuals and audio.
- Each server/room supports approximately 50 concurrent players.
- Only a single server instance will be run initially, but the codebase should be designed for future scaling (e.g., Redis pub/sub, stateless server logic).
- The game is session-based only; no user accounts or persistent stats.
- Monorepo structure: client and server code live in the same repository.
- No accessibility requirements beyond basic usability.
- No ads, in-app purchases, or analytics/tracking.
- There will be a single global chat for all players.
- No moderation or reporting features for now.
- 100% test coverage is required for all code.
- All deployment and hosting will be self-managed from office/home servers.

---

## Phase 1: Project Setup

**Step 1: Initialize Git & CI**  
- Create a Git repository at the workspace root and add a `.gitignore` for node modules and build artifacts.  
- Configure a GitHub Actions workflow that runs lint, type‐checks, and unit tests on every push/PR.  
- Test: Push any change to a feature branch and verify the CI workflow runs and all checks pass.

**Step 2: Scaffold Client with Vite**  
- Use Vite's TypeScript template to create a `client/` directory.  
- Install dependencies defined in the tech stack.  
- Test: Start the development server and open the app in a browser; confirm a blank canvas page loads without console errors.

**Step 3: Scaffold Server with Node & TypeScript**  
- Create a `server/` directory, initialize an npm project, and install Node.js, Express (or Fastify), Socket.IO, and TypeScript.  
- Add a simple HTTP health‐check endpoint (e.g. `/status`) that returns a success code.  
- Test: Send an HTTP request to the health‐check endpoint and confirm it returns a 200‐level response.

---

## Phase 2: Core Client Engine & Movement

**Step 4: Install and Configure Phaser**  
- Add Phaser 3 to the client dependencies and import it into the main game module.  
- Test: Compile the client code and confirm no import or type errors for Phaser.

**Step 5: Create Responsive Game Canvas**  
- Configure the main scene to initialize an HTML5 canvas that resizes to fill the browser viewport on load and window resize.  
- Test: Resize the browser window and confirm the canvas always matches the viewport dimensions.

**Step 6: Render Player Placeholder**  
- In the main scene, spawn a single player represented by a simple circle or sprite at a random position within the world bounds.  
- Test: Reload the page multiple times and confirm the dot appears at different screen positions each time.

**Step 7: Handle Keyboard Input**  
- Listen for arrow keys and WASD presses/releases, updating an internal input state per direction.  
- Test: Enable on‐screen debug text or console logs showing which direction flags are active when keys are pressed.

**Step 8: Move the Player**  
- In the game update loop (e.g. 60 FPS), translate the player based on the current input state and a base speed value.  
- Test: Press and hold each movement key and confirm the dot moves smoothly and continuously in the expected direction.

---

## Phase 3: World & Camera

**Step 9: Define World Dimensions & Camera**  
- Set up a larger toroidal world (e.g. 2000×2000 units) and attach the game camera to follow the player's position.  
- Test: Move the player to a far corner and verify the camera centers on the dot, exposing other parts of the world.

**Step 10: Implement Toroidal Wrap-Around**  
- When the player's position crosses any world boundary, teleport them to the opposite edge at the corresponding coordinate.  
- Test: Drive the dot off the right edge and confirm it reappears at the left edge at the same vertical position (and similarly for top/bottom).

---

## Phase 4: Snake Representation & Speed Scaling

**Step 11: Introduce Health Variable**  
- Add a numeric `health` property on the player object, initialized to 10.  
- Test: On spawn, output the health value to the console and confirm it reads "10."

**Step 12: Render Snake Segments**  
- Display a series of equally spaced circles (segments) trailing behind the head, matching the player's `health` count.  
- Test: Count the rendered circles on start and confirm they match the `health` value exactly.

**Step 13: Apply Speed Curve**  
- Implement a function that reduces movement speed as `health` increases along a configurable curve.  
- Test: Measure or log movement speed at `health = 10` versus `health = 20` and confirm the higher-health speed is lower per the curve.

---

## Phase 5: Collision & Growth

**Step 14: Circle-to-Circle Collision**  
- Implement precise collision checks between this player's head circle and every segment circle of other snakes.  
- Test: Position two players so that one head overlaps a segment of the other and confirm a collision event fires.

**Step 15: Consumption Logic**  
- On collision, compare `health` values: if `HealthA > HealthB`, add `HealthB` to `HealthA` and trigger respawn for B.  
- Test: Manually set one player's health significantly higher, collide, and confirm the stronger player's health increases by the weaker's count and the weaker respawns.

**Step 16: Respawn & Invulnerability**  
- When a snake respawns, place it at a random location and grant 1.5 seconds of invulnerability.  
- Test: Immediately after respawn, attempt a collision and confirm no consumption occurs until after the timer elapses.

**Step 17: Enforce Maximum Health**  
- Cap the `health` property at a defined maximum (e.g. 100 segments).  
- Test: Repeatedly consume smaller snakes until the cap is reached and confirm health stops increasing once the max is hit.

---

## Phase 6: Pickups & Obstacles

**Step 18: Pickup Manager**  
- Implement a system that spawns health and speed pickups at random positions at a configured interval.  
- Test: Observe the map over time and verify pickups appear at the expected rate and random locations.

**Step 19: Pickup Effects**  
- On player–pickup overlap, remove the pickup and apply: +health for health items, temporary +speed for speed items.  
- Test: Collect each pickup type and confirm the player's stats update and the effect duration resets correctly.

**Step 20: Static Obstacles**  
- Render optional walls or barriers and prevent the player from passing through them via collision response.  
- Test: Move the player against an obstacle face-on and confirm movement halts or slides without overlapping.

---

## Phase 7: Networking

**Step 21: Socket.IO Server Setup**  
- Launch a Socket.IO server that handles client connections and maintains authoritative state in memory.  
- Limit each server/room to approximately 50 concurrent players.  
- Design server logic to be stateless and ready for future scaling (e.g., Redis pub/sub integration, sharding logic).  
- Test: Connect a client and verify the server logs the new socket connection and assigns a unique ID.

**Step 22: Lobby & Snapshot**  
- Implement a lobby flow where new clients join a room and receive the current world snapshot (positions, health).  
- Test: Connect multiple clients consecutively and confirm each receives the same initial state.

**Step 23: State Broadcast at Tick Rate**  
- Broadcast position and health updates from server to all clients at 20 ticks per second.  
- Test: Monitor network messages and confirm the update frequency matches 20 Hz.

**Step 24: Client-Side Interpolation**  
- On the client, buffer incoming states and interpolate between them to smooth movement.  
- Test: Introduce artificial latency and confirm other player snakes move smoothly without jumping.

**Step 25: Reconciliation**  
- When a client's predicted state deviates from a server snapshot, smoothly correct the local state.  
- Test: Force a predicted-versus-authoritative discrepancy and confirm the client snaps to the correct location without jarring visuals.

**Step 26: Heartbeat & Reconnection**  
- Implement regular heartbeat messages and auto-reconnect logic on the client after network drop.  
- Test: Disable the network briefly in the browser, then restore it, and confirm the client reconnects and resumes play.

---

## Phase 8: UI / UX & Polish

**Step 27: HUD Elements**  
- Build on-screen overlays: mini-map, health/length bar, real-time leaderboard, and a single global chat window.  
- Test: Populate each element with sample data and confirm the layout is correct and updates dynamically.

**Step 28: Menu Screens**  
- Create lobby, settings, and pause menus with keyboard navigation support.  
- Test: Switch between menus using arrow keys and Enter/Escape, verifying focus and selection highlight follow keyboard input.

**Step 29: Visual & Audio Feedback**  
- Add particle effects and sound cues for pickups, consumptions, and respawns.  
- Test: Trigger each event and confirm the correct effect plays exactly once per event.

**Step 30: Accessibility & Theme**  
- (Removed: Accessibility requirements. Only basic usability and color contrast for clarity.)

---

## Phase 9: Testing & Deployment

**Step 31: Unit Testing**  
- Write Jest tests for core logic: health math, collision detection, wrap-around behavior.  
- Test: Execute the test suite and confirm 100% pass rate and 100% code coverage.

**Step 32: End-to-End Testing**  
- Implement Playwright or Cypress tests to cover user flows: movement, collision, pickup, UI navigation, and chat.  
- Test: Run E2E tests in a headless environment and confirm all scenarios pass without manual steps.

**Step 33: CI Integration**  
- Ensure GitHub Actions runs lint, type checks, unit tests, E2E tests, and code coverage (100%) on every pull request.  
- Test: Open or update a PR and confirm the full test matrix completes successfully.

**Step 34: Dockerization**  
- Write Dockerfiles for client and server that build and serve the applications in containers.  
- Test: Build images locally, run containers, and verify the client can connect to the server and play.

**Step 35: Self-Hosted Deployment**  
- Deploy the Dockerized stack to a self-hosted environment (office/home server).  
- Test: Open the local/staging URL with multiple browser windows and confirm multiplayer interactions function correctly under light load.

---

## CI Pipeline Requirements

- Lint all code (client and server).
- Type-check all TypeScript code.
- Run all unit tests (Jest) and ensure 100% code coverage.
- Run all end-to-end tests (Playwright or Cypress).
- Build Docker images for client and server.
- Deploy to self-hosted server (manual or automated step).

---

_End of Implementation Plan_
