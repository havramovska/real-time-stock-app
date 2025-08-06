# Real-Time Stock App

A real-time stock monitoring application built with Angular frontend and Node.js WebSocket backend.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start both frontend and backend
npm run start:dev

# Or start individually
npm start                    # Frontend only
npm run start:backend        # Backend only
```

## 📍 URLs

- **Frontend**: http://localhost:4200
- **WebSocket**: ws://localhost:3001

## 🛠️ Available Scripts

```bash
# Development
npm start                    # Start frontend
npm run start:backend        # Start WebSocket server
npm run start:dev           # Start both apps

# Build
npm run build               # Build all apps
npm run build:frontend      # Build frontend only
npm run build:models        # Build shared models

# Development tools
npm run lint                # Lint all projects
npm run test                # Test all projects
npm run clean               # Clear cache
```

## 🏗️ Project Structure

```
real-time-stock-app/
├── apps/
│   ├── frontend/           # Angular application
│   └── websocket-server/   # Node.js WebSocket server
├── libs/
│   └── models/            # Shared TypeScript interfaces
└── package.json           # Workspace dependencies
```

## 📄 License

MIT License
