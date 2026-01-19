# Frontend Admin Service VTEAM06

Admin UI for the SparkRunners system.
Built with React + Vite, using React Router, Leaflet for maps and Socket.IO for live simulation data.

---

## Tech stack

- React (Vite)
- React Router
- React Leaflet (OpenStreetMap)
- Socket.IO Client (live simulation)
- ESLint (linting)
- Vitest + Testing Library (tests)

---

## Requirements

- Node.js (LTS recommended)
- npm

---

## Installation

npm install

---

## Environment variables

Create a .env file in the project root:

VITE_AUTH_BASE_URL=<http://localhost:3001>
VITE_AUTH_URL=<http://localhost:3001>
VITE_API_URL=<http://localhost:3002>

VITE_API_URL should point to the backend API (user server / gateway).

---

## Run locally (development)

npm run dev

Open the URL printed by Vite (usually <http://localhost:5173>).

---

## Build

npm run build

Preview the production build:

npm run preview

---

## Lint

npm run lint

---

## Tests

Run tests in watch mode (local development):

npm run test

Run tests once (CI-friendly):

npm run test:run

---

## Live simulation data

The admin UI can receive live scooter updates via Socket.IO.

- When live data is available, the UI automatically switches to simulation data
- When disconnected, it falls back to REST API data
- Connection status and update time are shown in the Dashboard and Map views

---

## Project structure

src/

- pages/        Main pages (Dashboard, Scooters, Login, etc.)
- features/     Feature areas (Map, Rides, Payments, Stations)
- api/          API clients, Socket.IO, hooks
- components/   Shared UI components
- __tests__/    Vitest tests

---

## Notes

- This project includes automated tests and linting
- Suitable for CI pipelines
- Frontend runs independently via Vite
- Backend services are provided separately (Docker-based)
