# Sports Conflict Tracker

[![CI](https://github.com/Slayniaccc/Sports-Conflict-Tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/Slayniaccc/Sports-Conflict-Tracker/actions/workflows/ci.yml)

Detects fixture clashes across the teams you follow and scores which match to watch, with the reasoning spelled out.

You follow teams in several leagues. When their matches overlap, the app finds the clash, scores each fixture with a set of weighted rules (rivalry, playoff implications, home advantage, your favourite team), and explains the ranking.

```json
{
  "fixture": "Lakers vs Celtics",
  "league": "NBA",
  "score": 50,
  "explanation": "RivalryRule: +20. PlayoffImplicationRule: +25. HomeAdvantageRule: +5."
}
```

*(Illustrative response from `GET /api/fixtures/scored`.)*

**Status:** backend feature-complete. Frontend (React + TypeScript + Tailwind) has auth, the fixture list, fixture pages and team pages. See [ROADMAP.md](ROADMAP.md) for what's next.

## Features

- Fixture sync for NBA, NFL, MLB and EPL through one unified pipeline
- Rule-based conflict scoring with human-readable explanations
- JWT authentication (registration, login, protected endpoints)
- League filtering: `GET /api/fixtures/scored?league=NBA`
- Personalised scores: set a favourite team and its fixtures get a +15 bonus (logged-out users get base scores)
- Team pages: `GET /api/teams/{id}` returns a team and all its fixtures, scored for the current user

## Tech Stack

| Area | Technology |
|------|------------|
| Backend | Java 21, Spring Boot 3.3, Spring Security (JWT) |
| Database | Postgres 16, Flyway migrations |
| Data sources | BALLDONTLIE (NBA/NFL/MLB), Football-Data.org (EPL) |
| Tooling | Maven, JUnit, Docker, GitHub Actions |
| Frontend | TypeScript, React, Vite, Tailwind CSS, React Router *(in progress)* |
| Deployment | Railway or Fly.io *(planned)* |

## Getting Started

### Prerequisites

- JDK 21
- Maven
- Node.js and npm (for the frontend)
- Docker (for Postgres)
- API keys for [BALLDONTLIE](https://www.balldontlie.io) and [Football-Data.org](https://www.football-data.org)

### Run locally

```bash
# 1. Configure environment: create .env in the project root with
#    Postgres credentials, API keys and a JWT secret

# 2. Start Postgres
docker compose up -d postgres

# 3. Run the backend (loads .env; Flyway migrations apply on startup)
./scripts/run-backend.sh

# 4. Run the frontend (in a second terminal)
cd sct-frontend && npm install && npm run dev    # http://localhost:5173
```

Run the tests (also loads `.env`):

```bash
./scripts/run-tests.sh                            # all tests
./scripts/run-tests.sh -Dtest=ConflictEngineTest  # one class
```

Sync tests call the live APIs and can hit free-tier rate limits (HTTP 429) if run back to back.

Then register a user and call the API:

```bash
curl -X POST localhost:8080/api/users/register -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"changeme"}'

curl localhost:8080/api/fixtures/scored?league=NBA
```

To get personalised scores, log in, set a favourite team, and send the token:

```bash
TOKEN=$(curl -s -X POST localhost:8080/api/users/login -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"changeme"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

curl -X PUT localhost:8080/api/users/me/favorite-team \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"teamId": 96}'

curl -H "Authorization: Bearer $TOKEN" localhost:8080/api/teams/96
```

## Architecture

The rule engine is pure Java with no framework dependencies. Spring is layered around it for the API and persistence.

| Package | Responsibility |
|---------|----------------|
| `client` | Calls BALLDONTLIE and Football-Data.org and maps responses to DTOs |
| `config` | Spring Security, JWT utilities, the `ConflictEngine` bean |
| `controller` | REST API |
| `dto` | Request and response shapes |
| `engine` | Aggregates rule outputs into a conflict score |
| `entity` / `repository` | JPA entities and Spring Data repositories |
| `model` | Domain records: `Team`, `Fixture`, `ConflictScore` |
| `rules` | `ImportanceRule` interface and implementations |
| `service` | Sync orchestration, date parsing, fixture mapping |
| `resources/db/migration` | Flyway migrations V1 to V6 |

### Data ingestion

Every provider flows through the same pipeline:

`Provider API` → `Client DTO` → `FixtureSyncService` → `TeamSyncService (lookup)` → `DB`

| League | Provider | Auth header | Response envelope | Field quirks |
|--------|----------|-------------|-------------------|--------------|
| NBA | BALLDONTLIE | `Authorization` | `{data: [...], meta: {...}}` | `datetime`, `visitor_team` |
| NFL | BALLDONTLIE | `Authorization` | `{data: [...], meta: {...}}` | `date`, `visitor_team` |
| MLB | BALLDONTLIE | `Authorization` | `{data: [...], meta: {...}}` | `date`, `away_team`, `season_type` |
| EPL | Football-Data.org | `X-Auth-Token` | `{matches: [...]}` | `utcDate`, `homeTeam`/`awayTeam` |

All leagues write to one `fixture` table, disambiguated by a composite `(league, external_id)` unique constraint. Lookups are league-scoped to prevent ID collisions across sports.

### Conflict scoring

`ConflictEngine` aggregates the active `ImportanceRule` implementations plus a per-user favourite team bonus:

| Rule | Score |
|------|-------|
| `RivalryRule` | +20 for rivalry matches |
| `PlayoffImplicationRule` | +25 for playoff implications |
| `HomeAdvantageRule` | +5 baseline fixture bonus |
| `FavoriteTeamRule` | +15 when the logged-in user's favourite team is playing |

It returns a `ConflictScore` with the fixture, the composite score, and an explanation string.

## Engineering Notes

Some decisions worth calling out:

- **Idempotent syncs:** re-running a sync doesn't duplicate data, and this is covered by tests.
- **Resilient ingestion:** cursor pagination for BALLDONTLIE, MLB `season_type` filtering, EPL season consistency checks, null and malformed date handling, typed HTTP exceptions, and per-sync rate limiting for the free-tier limits (5 and 10 req/min).
- **Framework-free core:** keeping the rule engine independent of Spring makes it easy to unit test and extend.

## Roadmap

Next up: plain-English reasoning strings, a rivalries table with intensity, a profile page for choosing your favourite team, then a frontend redesign. Later: deployment, user-defined rule weightings, kickoff alerts and calendar export, and a redesigned stake model for European formats (title races, relegation battles). Full plan, known technical debt and design proposals are in [ROADMAP.md](ROADMAP.md).

## Data Sources

- [BALLDONTLIE](https://api.balldontlie.io): NBA, NFL, MLB (5 req/min on the free tier)
- [Football-Data.org](https://api.football-data.org/v4): EPL (10 req/min on the free tier)