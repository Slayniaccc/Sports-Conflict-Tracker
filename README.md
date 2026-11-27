# Sports Conflict Tracker

[![CI](https://github.com/Slayniaccc/Sports-Conflict-Tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/Slayniaccc/Sports-Conflict-Tracker/actions/workflows/ci.yml)

Detects fixture clashes across the teams you follow and scores which match to watch, with the reasoning spelled out.

You follow teams in several leagues. When their matches overlap, the app finds the clash, scores each fixture with a set of weighted rules (rivalry, playoff implications, home advantage, your favourite team), and explains the ranking.

```json
{
  "fixture": { "homeTeam": { "name": "LA Clippers" }, "awayTeam": { "name": "Los Angeles Lakers" }, "kickoff": "…" },
  "score": 40,
  "reasoning": "Battle of LA: LA Clippers vs Los Angeles Lakers · Your team Los Angeles Lakers travels to LA Clippers · Home court for LA Clippers",
  "factors": [
    { "kind": "RIVALRY", "points": 20, "label": "Battle of LA" },
    { "kind": "FAVORITE_TEAM", "points": 15, "label": "Your team travels" },
    { "kind": "HOME", "points": 5, "label": "Home court" }
  ]
}
```

*(Shortened response from `GET /api/fixtures/scored`, for a user whose favourite team is the Lakers. Each factor also carries a full `reason` sentence.)*

*(Illustrative response from `GET /api/fixtures/scored`.)*

**Status:** backend feature-complete for fixtures, scoring and auth. The frontend redesign is done: a ranked home page with clash detection, fixture and team pages, and sign-in. Next up are an account page and match results. See [ROADMAP.md](ROADMAP.md).

## Features

- Fixture sync for NBA, NFL, MLB and EPL through one unified pipeline
- Rule-based conflict scoring with human-readable explanations
- JWT authentication (registration, login, protected endpoints)
- League filtering: `GET /api/fixtures/scored?league=NBA`
- Personalised scores: set a favourite team and its fixtures get a +15 bonus (logged-out users get base scores)
- Team pages: `GET /api/teams/{id}` returns a team and all its fixtures, scored for the current user
- Rivalries stored in Postgres with an intensity (1–3) and a name, e.g. "Battle of LA"
- Structured scoring factors (`kind`, `points`, `label`, `reason`) alongside the readable reasoning
- Clash detection: games in the same league whose time windows overlap are flagged
- Redesigned frontend: ranked day-by-day fixtures, a weekly top pick, score breakdowns, team pages, skeleton loading and reduced-motion-aware animations

## Tech Stack

| Area | Technology |
|------|------------|
| Backend | Java 21, Spring Boot 3.3, Spring Security (JWT) |
| Database | Postgres 16, Flyway migrations |
| Data sources | BALLDONTLIE (NBA/NFL/MLB), Football-Data.org (EPL) |
| Tooling | Maven, JUnit, AssertJ, Testcontainers, Docker, GitHub Actions |
| Frontend | TypeScript, React 19, Vite, Tailwind CSS v4, React Router, Motion, lucide-react |
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

Tests that call the live APIs are skipped unless `RUN_LIVE_SYNC_TESTS=true`, because they can hit free-tier rate limits (HTTP 429) when run back to back. `RivalryRepositoryTest` runs against a throwaway Postgres via Testcontainers, so Docker must be running; without Docker it is skipped.

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
| `engine` | Aggregates rule outputs into a conflict score; `RivalryLookup` holds rivalries in memory |
| `entity` / `repository` | JPA entities and Spring Data repositories |
| `model` | Domain records: `Team`, `Fixture`, `Factor`, `ConflictScore`, `Rivalry` |
| `rules` | `ImportanceRule` interface and implementations |
| `service` | Sync orchestration, date parsing, fixture mapping |
| `resources/db/migration` | Flyway migrations V1 to V8 |

The frontend lives in `sct-frontend/src`: `pages/` (home, fixture, team, login, register), `components/`, `hooks/`, `lib/` (pure helpers such as clash detection and day grouping), `api/` and `contexts/`.

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

| Factor | Score |
|------|-------|
| `RivalryRule` | +10 × intensity (1–3), from the `rivalry` table |
| `PlayoffImplicationRule` | +25 when the fixture is flagged as having playoff implications |
| `HomeAdvantageRule` | +5 for the home team (court, field or ground by league) |
| Favourite team | +15 when the logged-in user's favourite team is playing |

It returns a `ConflictScore` with the fixture, the total, a readable `reasoning` string, and the `factors` sorted biggest first.

## Engineering Notes

Some decisions worth calling out:

- **Idempotent syncs:** re-running a sync doesn't duplicate data, and this is covered by tests.
- **Resilient ingestion:** cursor pagination for BALLDONTLIE, MLB `season_type` filtering, EPL season consistency checks, null and malformed date handling, and typed HTTP exceptions. A between-page delay for free-tier rate limits exists but is currently set to 0.
- **Framework-free core:** keeping the rule engine independent of Spring makes it easy to unit test and extend.
- **Tests that don't depend on your machine:** live-API tests are opt-in, and the repository test uses Testcontainers instead of the dev database.
- **Derived UI state:** loading states are worked out from the stored result and the current URL rather than set inside effects, which avoids stale content and extra renders.

## Roadmap

Next up: an account page (favourite team picker, sign out, automatic sign-out on an expired token), then match results, form and momentum, standings-based stakes, and richer reasoning built on that data. Later: frontend tests and lint in CI, deployment, user-defined rule weightings, kickoff alerts and calendar export. Full plan, known technical debt and design proposals are in [ROADMAP.md](ROADMAP.md).

## Data Sources

- [BALLDONTLIE](https://api.balldontlie.io): NBA, NFL, MLB (5 req/min on the free tier)
- [Football-Data.org](https://api.football-data.org/v4): EPL (10 req/min on the free tier)