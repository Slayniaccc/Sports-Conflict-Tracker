# Sports Conflict Tracker

[![CI](https://github.com/Slayniaccc/Sports-Conflict-Tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/Slayniaccc/Sports-Conflict-Tracker/actions/workflows/ci.yml)

Detects fixture clashes across the teams you follow and scores which match to watch, with the reasoning spelled out.

You follow teams in several leagues. When their matches overlap, the app finds the clash, scores each fixture with a set of weighted rules (rivalry, playoff implications, home advantage), and explains the ranking.

```json
{
  "fixture": "Lakers vs Celtics",
  "league": "NBA",
  "score": 50,
  "explanation": "RivalryRule: +20. PlayoffImplicationRule: +25. HomeAdvantageRule: +5."
}
```

*(Illustrative response from `GET /api/fixtures/scored`.)*

**Status:** backend feature-complete. Frontend (React + TypeScript + Tailwind) is in progress. See [ROADMAP.md](ROADMAP.md) for what's next.

## Features

- Fixture sync for NBA, NFL, MLB and EPL through one unified pipeline
- Rule-based conflict scoring with human-readable explanations
- JWT authentication (registration, login, protected endpoints)
- League filtering: `GET /api/fixtures/scored?league=NBA`

## Tech Stack

| Area | Technology |
|------|------------|
| Backend | Java 21, Spring Boot 3.3, Spring Security (JWT) |
| Database | Postgres 16, Flyway migrations |
| Data sources | BALLDONTLIE (NBA/NFL/MLB), Football-Data.org (EPL) |
| Tooling | Maven, JUnit, Docker, GitHub Actions |
| Frontend | TypeScript, React, Tailwind CSS *(in progress)* |
| Deployment | Railway or Fly.io *(planned)* |

## Getting Started

### Prerequisites

- JDK 21
- Maven
- Docker (for Postgres)
- API keys for [BALLDONTLIE](https://www.balldontlie.io) and [Football-Data.org](https://www.football-data.org)

### Run locally

```bash
# 1. Configure environment
cp .env.example .env        # add your API keys and a JWT secret

# 2. Start Postgres
docker compose up -d db

# 3. Run the backend (Flyway migrations apply on startup)
./mvnw spring-boot:run
```

Then register a user and call the API:

```bash
curl -X POST localhost:8080/api/users/register -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"changeme"}'

curl localhost:8080/api/fixtures/scored?league=NBA
```

> Adjust the commands above to match your actual setup (Maven wrapper, compose service name, request fields).

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
| `resources/db/migration` | Flyway migrations V1 to V5 |

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

`ConflictEngine` aggregates the active `ImportanceRule` implementations:

| Rule | Score |
|------|-------|
| `RivalryRule` | +20 for rivalry matches |
| `PlayoffImplicationRule` | +25 for playoff implications |
| `HomeAdvantageRule` | +5 baseline fixture bonus |

It returns a `ConflictScore` with the fixture, the composite score, and an explanation string.

## Engineering Notes

Some decisions worth calling out:

- **Idempotent syncs:** re-running a sync doesn't duplicate data, and this is covered by tests.
- **Resilient ingestion:** cursor pagination for BALLDONTLIE, MLB `season_type` filtering, EPL season consistency checks, null and malformed date handling, typed HTTP exceptions, and per-sync rate limiting for the free-tier limits (5 and 10 req/min).
- **Framework-free core:** keeping the rule engine independent of Spring makes it easy to unit test and extend.

## Roadmap

Next up: the React frontend, deployment, kickoff alerts and calendar export, and a redesigned stake model for European formats (title races, relegation battles). Full plan, known technical debt and design proposals are in [ROADMAP.md](ROADMAP.md).

## Data Sources

- [BALLDONTLIE](https://api.balldontlie.io): NBA, NFL, MLB (5 req/min on the free tier)
- [Football-Data.org](https://api.football-data.org/v4): EPL (10 req/min on the free tier)