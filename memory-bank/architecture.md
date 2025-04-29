# Project Architecture

## Project Structure

```
multiplayergame/
├── .github/
│   └── workflows/
│       └── ci.yml           # GitHub Actions workflow for CI
├── client/                  # Vite-based game client
│   ├── src/
│   │   ├── scenes/
│   │   │   └── MainScene.ts # Main game scene
│   │   └── main.tsx        # Game entry point
│   ├── index.html          # Client HTML template
│   ├── package.json        # Client dependencies
│   ├── tsconfig.json       # Client TypeScript config
│   └── vite.config.ts      # Vite bundler config
├── src/
│   └── utils/
│       ├── math.ts         # Sample utility functions
│       └── math.test.ts    # Tests for utility functions
├── .eslintrc.json         # ESLint configuration
├── .gitignore            # Git ignore patterns
├── jest.config.js        # Jest test configuration
├── package.json         # Project dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── README.md          # Project documentation
```

## Configuration Files

### TypeScript Configuration (`tsconfig.json`)
- Strict type checking enabled
- ES2020 target with ESNext module system
- Source map generation for debugging
- Strict null checks and other safety features

### ESLint Configuration (`.eslintrc.json`)
- TypeScript-aware linting rules
- Strict type checking in linting
- Enforces explicit return types
- Prevents usage of `any` type

### Jest Configuration (`jest.config.js`)
- TypeScript support via ts-jest
- 100% code coverage requirement
- Excludes type definition files
- Configured for Node.js environment

### GitHub Actions Workflow (`.github/workflows/ci.yml`)
- Runs on push to main and pull requests
- Installs Node.js and dependencies
- Runs linting, type checking, and tests
- Uploads coverage reports

## Source Code Organization

### Client Directory (`client/`)
- Vite-based TypeScript setup
- Phaser 3 game engine integration
- Responsive canvas configuration
- Scene-based game structure

### Utils Directory (`src/utils/`)
- Contains reusable utility functions
- Each module has accompanying test file
- Follows single responsibility principle

## Testing Strategy

- Jest for unit testing
- 100% code coverage required
- Tests co-located with source files
- Separate test file for each module

## Future Additions

The following directories will be added in subsequent steps:
- `server/` - Node.js/Express TypeScript server
- `shared/` - Shared types and utilities
- `assets/` - Game assets and resources

## Server Structure

### Directory Layout
```
server/
├── src/
│   └── server.ts    # Main server entry point
├── dist/            # Compiled JavaScript output
├── package.json     # Dependencies and scripts
└── tsconfig.json    # TypeScript configuration
```

### Key Files

#### server.ts
Main server entry point that:
- Initializes Express application
- Sets up HTTP server
- Configures Socket.IO for real-time communication
- Implements health check endpoint at `/status`
- Handles basic Socket.IO connection events

### Configuration Files

#### tsconfig.json
TypeScript configuration that:
- Targets ES2020 for modern Node.js compatibility
- Outputs compiled files to `dist/` directory
- Enables strict type checking
- Configures module resolution and paths

#### package.json
NPM configuration with scripts:
- `npm run dev`: Development mode with hot reload
- `npm run build`: Compile TypeScript to JavaScript
- `npm start`: Run compiled server in production mode

### Network Architecture
- HTTP server runs on port 3001 (configurable via PORT env variable)
- Socket.IO enabled with CORS for real-time game state updates
- RESTful endpoint `/status` for health monitoring
- WebSocket connections for real-time game state synchronization
