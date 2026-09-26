# Sports Conflict Tracker

Detects fixture clashes across your followed sports teams and scores which one to watch, with reasoning.

## Overview

You follow teams across multiple leagues. When matches overlap, this app detects the clashes, scores which fixture takes priority using a set of weighted rules (rivalry, playoff implications, current form, home/away), and explains the reasoning behind the ranking.

Core capabilities:
- Cross-league fixture clash detection
- Multi-factor conflict scoring with explanation strings
- Team dashboards and kickoff alerts
- Calendar export and head-to-head historical stats

## Stack

- **Backend:** Java 21, Spring Boot 3.3, Postgres 16, Flyway
- **Frontend:** TypeScript, Tailwind CSS *(not started)*
- **Data:** BALLDONTLIE (NBA/NFL/MLB) and Football-Data.org (EPL)
- **Infra:** Docker, GitHub Actions, deployed on Railway/Fly.io

## Architecture

backend/
├── client/           : API clients (BALLDONTLIE, Football-Data.org) + response DTOs
├── config/           : Spring Security, JWT filter/util, ConflictEngine bean
├── controller/       : REST endpoints
├── dto/              : API request/response shapes
├── engine/           : ConflictEngine, aggregates rule outputs into a score
├── entity/           : JPA entities (persistence layer)
├── model/            : domain records (Team, Fixture, ConflictScore)
├── repository/       : Spring Data JPA repositories
├── rules/            : ImportanceRule interface + implementations
├── service/          : orchestration layer (TeamSyncService, FixtureSyncService, DateParsing, FixtureMapper)
└── resources/
    └── db/migration/ : Flyway migrations V1–V5

frontend/             : TypeScript + Tailwind UI (not started)

The rule engine is pure Java with no framework dependencies. Spring is layered around it to handle API and persistence concerns.

### Data Ingestion

Fixture data flows through a unified pipeline regardless of source:

`Provider API` → `Client DTO` → `FixtureSyncService` → `TeamSyncService (lookup)` → `DB`

| League | Provider | Auth header | Response envelope | Field quirks |
|--------|----------|-------------|-------------------|--------------|
| NBA | BALLDONTLIE | `Authorization` | `{data: [...], meta: {...}}` | `datetime`, `visitor_team` |
| NFL | BALLDONTLIE | `Authorization` | `{data: [...], meta: {...}}` | `date`, `visitor_team` |
| MLB | BALLDONTLIE | `Authorization` | `{data: [...], meta: {...}}` | `date`, `away_team`, `season_type` |
| EPL | Football-Data.org | `X-Auth-Token` | `{matches: [...]}` | `utcDate`, `homeTeam`/`awayTeam` |

All leagues write to the same `fixture` table, disambiguated by a composite `(league, external_id)` unique constraint. Lookups are league-scoped to prevent ID collisions across sports.

### Conflict Scoring

`ConflictEngine` aggregates active `ImportanceRule` implementations:

- **RivalryRule** — +20 for rivalry matches
- **PlayoffImplicationRule** — +25 for playoff implications
- **HomeAdvantageRule** — +5 baseline fixture bonus

Returns a `ConflictScore` containing the fixture, composite score, and explanation payload (e.g., `"RivalryRule: +20. PlayoffImplicationRule: +25. HomeAdvantageRule: +5."`).

Endpoint: `GET /api/fixtures/scored` (optional `?league=` filter).

## Status

Backend feature-complete; frontend not started.

### Completed

- [x] Project scaffolding, JDK/Maven/JUnit toolchain
- [x] Domain model and rule engine
- [x] Postgres schema and Flyway migrations (V1–V5)
- [x] Spring Boot API setup, JPA entities, repositories
- [x] JWT authentication (registration/login, protected endpoints)
- [x] Team sync for NBA, NFL, MLB, and EPL
- [x] Fixture sync for all leagues
- [x] Composite `(league, external_id)` constraints
- [x] BALLDONTLIE cursor pagination
- [x] MLB `season_type` filter
- [x] EPL season consistency checks
- [x] Null/malformed date handling
- [x] Typed HTTP exceptions
- [x] Per-sync rate limiting
- [x] Sync idempotency tests
- [x] ConflictEngine wired to `GET /api/fixtures/scored`

### Next Steps

- [ ] Frontend (Vite + React + TypeScript + Tailwind)
- [ ] Deployment setup (Railway or Fly.io)
- [ ] Alerts and calendar export
- [ ] Historical stats integration

## Backend Maintenance & Technical Debt

### Reliability

- [ ] Global rate limiter (resolve concurrent sync 429 errors)
- [ ] Test DB isolation (decouple tests from dev DB)
- [ ] Transactional test wrappers
- [ ] Test environment config (`src/test/resources/application-test.yml`)
- [ ] Cross-league integrity tests

### Schema & Data Access

- [ ] Standardize `team.external_id` (varchar 50) and `fixture.external_id` (varchar 255)
- [ ] Resolve N+1 queries on fixture reads (`JOIN FETCH` / `@EntityGraph`)

### Security

- [ ] Revert `SecurityConfig` `permitAll` on `/api/fixtures/scored`
- [ ] API key rotation and `.env` verification

### Code Quality

- [ ] Disable `spring.jpa.open-in-view`
- [ ] Disable `spring.jpa.show-sql` for production profiles
- [ ] Implement `equals`/`hashCode` for `TeamEntity` and `AppUserEntity`
- [ ] Clean up redundant root-level `src/` directory

## Proposed Design — Stake Model

The current boolean flags (`isRivalry`, `isPlayoffImplication`) do not fit European formats (e.g., Premier League title races, European qualification spots, relegation battles).

Planned refactor: replace booleans with a unified `FixtureStakes` enum on `FixtureEntity`:
`NONE` | `RIVALRY` | `PLAYOFF` | `TITLE_RACE` | `EUROPEAN_QUAL` | `RELEGATION`

- Store rivalry definitions in a dedicated `rivalry` table (`league`, `team_a_id`, `team_b_id`, `intensity`, `note`).
- Implement standalone stake detection engines per league type.

## Data Sources

- **BALLDONTLIE** — `https://api.balldontlie.io` — NBA, NFL, MLB (5 req/min free tier)
- **Football-Data.org** — `https://api.football-data.org/v4` — EPL (10 req/min free tier)

## Frontend Roadmap

### Phase 1 — UI/UX Design

- [ ] Core screen wireframes
- [ ] App navigation hierarchy
- [ ] Fixture card layout (score and reasoning display)
- [ ] Visual representation of overlapping kickoff times
- [ ] Design system setup (palette, typography)

### Phase 2 — Setup & Scaffolding

- [ ] Initialize Vite + React + TypeScript
- [ ] Configure Tailwind CSS
- [ ] Setup React Router
- [ ] Configure ESLint + Prettier
- [ ] Project directory setup (`pages/`, `components/`, `api/`, `types/`, `hooks/`)

### Phase 3 — Authentication

- [ ] Login screen (`POST /api/users/login`, JWT persistence)
- [ ] Register screen (`POST /api/users/register`)
- [ ] HTTP client interceptors for `Authorization` header injection
- [ ] Auth guards for protected routes

### Phase 4 — Core Views

- [ ] Scored fixture list view (`GET /api/fixtures/scored`)
- [ ] League filtering (`?league=NBA`)
- [ ] Priority sorting
- [ ] Fixture detail modal / page with score breakdown
- [ ] Loading, error, and empty states

### Phase 5 — Team Preferences

- [ ] Team selection interface (`GET /api/teams`)
- [ ] Follow/unfollow team actions
- [ ] Personalised fixture feed filtered by followed teams
- [ ] Clash visualization for overlapping match times

### Phase 6 — Interface Refinements

- [ ] Layout responsiveness
- [ ] Dark theme support
- [ ] Skeleton loading states
- [ ] Global error boundary and toast notifications

### Phase 7 — Deployment

- [ ] Frontend deployment (Vercel / Netlify)
- [ ] Environment variable mapping
- [ ] Backend CORS configuration
- [ ] Production deployment to Railway / Fly.io

## Future Enhancements

- Kickoff notifications and clash alerts
- Calendar synchronization (iCal / Google Calendar)
- Historical head-to-head statistics
