# Sports Conflict Tracker

Detects fixture clashes across your followed sports teams and scores which one to watch, with reasoning.

## What it does

You follow teams across multiple leagues. Sometimes two of them play at the same time. This app detects those clashes, scores which fixture matters more using a set of weighted rules (rivalry, playoff implications, current form, home/away), and explains *why*. Not just which score is higher, but the reasoning behind it.

Conflict resolution is the core of the app. Built around it: team dashboards, kickoff alerts, calendar export, and historical stats (streaks, head-to-head records) across your followed teams.

## Stack

- **Backend:** Java 21, Spring Boot 3.3, Postgres 16, Flyway
- **Frontend:** TypeScript, Tailwind CSS
- **Data:** BALLDONTLIE (NBA/NFL/MLB) and Football-Data.org (EPL)
- **Infra:** Docker, GitHub Actions, deployed on Railway/Fly.io

## Architecture

```
backend/
├── client/     : API clients (BALLDONTLIE, Football-Data.org) + response DTOs
├── config/     : Spring Security, JWT filter/util
├── controller/ : REST endpoints
├── dto/        : API request/response shapes
├── engine/     : ConflictEngine, aggregates rule outputs into a score
├── entity/     : JPA entities (persistence layer)
├── model/      : domain records (Team, Fixture, ConflictScore)
├── repository/ : Spring Data JPA repositories
├── rules/      : ImportanceRule interface + implementations
├── service/    : orchestration layer (TeamSyncService, FixtureSyncService, etc.)
└── resources/
    └── db/migration/  : Flyway migrations V1–V5

frontend/       : TypeScript + Tailwind UI (not started)
```

The rule engine is pure Java with no framework dependency. It can be tested in isolation and doesn't know or care that Spring, Postgres, or a frontend exist. Spring is layered around it, not through it.

### Data ingestion

Fixture data flows through a shared pipeline regardless of source:

```
Provider API  →  Client DTO  →  FixtureSyncService  →  TeamSyncService (lookup)  →  DB
```

Two providers, four leagues:

| League | Provider | Auth header | Response envelope | Field quirks |
|--------|----------|-------------|-------------------|--------------|
| NBA | BALLDONTLIE | `Authorization` | `{data: [...]}` | `datetime`, `visitor_team` |
| NFL | BALLDONTLIE | `Authorization` | `{data: [...]}` | `date`, `visitor_team` |
| MLB | BALLDONTLIE | `Authorization` | `{data: [...]}` | `date`, `away_team` |
| EPL | Football-Data.org | `X-Auth-Token` | `{matches: [...]}` | `utcDate`, `homeTeam`/`awayTeam` |

All four write to the same `fixture` table, disambiguated by a composite `(league, external_id)` unique constraint. Team IDs collide across leagues (NBA team 1 and NFL team 1 are different teams), so every lookup is league-scoped.

## Status

🚧 In development.

- [x] Project scaffolding, JDK/Maven/JUnit toolchain
- [x] Domain model + rule engine (pure Java, tested independently of Spring)
- [x] Postgres schema + Flyway migrations (V1–V5)
- [x] Spring Boot setup, JPA entities, repositories, initial REST endpoints
- [x] JWT authentication (registration/login, protected endpoints)
- [x] NBA team sync via BALLDONTLIE
- [x] NFL team sync via BALLDONTLIE
- [x] MLB team sync via BALLDONTLIE
- [x] EPL team sync via Football-Data.org
- [x] NBA fixture sync
- [x] NFL fixture sync
- [x] MLB fixture sync
- [x] EPL fixture sync
- [x] Composite `(league, external_id)` constraints to prevent cross-league ID collisions
- [ ] Pagination for BALLDONTLIE fixture sync (currently 25 games per league)
- [ ] MLB `season_type` filter (spring training games currently mixed in)
- [ ] Frontend
- [ ] Deployment
- [ ] Alerts + calendar export
- [ ] Historical stats (streaks, head-to-head)

## Known Issues / Pre-Frontend Checklist

These are the known gaps to address before wiring the frontend.

### Data completeness
- [ ] **Pagination on BALLDONTLIE endpoints.** Currently only page 1 is fetched (25 games per league). NBA seasons have ~1230 games, NFL ~272, MLB ~2430. Real data is required for conflict detection to be useful.
- [ ] **MLB `season_type` filter.** The MLB endpoint returns spring training, regular season, and postseason games in one response. Spring training games are currently mixed in. Add a filter at ingest time or add a `season_type` column to `fixture`.
- [ ] **Cross-season team mismatches.** EPL team sync and fixture sync must use the same season (`season=2026`). If they diverge, fixtures reference team IDs that don't exist and the sync throws `Unknown home team`. Worth a shared `EPL_SEASON` constant.

### Reliability
- [ ] **Null datetime guard.** `Instant.parse(game.datetime())` will NPE if the API ever returns `null`. Add a skip or throw.
- [ ] **HTTP error handling.** `RestClient.retrieve().body(...)` returns `null` on non-2xx responses, causing silent failures. Consider `.onStatus(...)` to throw clearly, or wrap in an explicit null check.
- [ ] **Rate limiting.** Football-Data.org free tier is 10 req/min. Currently no throttling — a full test-suite run can trip the limit.
- [ ] **Test isolation.** Tests currently mutate the dev DB. Consider `@Transactional` on test classes, or a separate test database.

### Test coverage
- [ ] **Retry-idempotency tests.** Running the test suite twice should produce the same counts. Currently verified manually.
- [ ] **Cross-league integrity test.** Assert that no fixture's `home_team.league` differs from `fixture.league`. Verified manually via SQL.
- [ ] **`src/test/resources/application.yml`.** Tests currently require environment variables to be sourced before running. A test-specific config file (gitignored) would remove that dependency.

### Schema
- [ ] **`team.external_id` is `varchar(50)` while `fixture.external_id` is `varchar(255)`.** Inconsistent but not broken. Consider aligning.
- [ ] **N+1 queries on fixture reads.** `FixtureEntity.homeTeam`/`awayTeam` are lazy-loaded. Consider `JOIN FETCH` queries or `@EntityGraph` for list endpoints.

### Security / secrets
- [ ] **Rotate API keys.** Development keys should be rotated before any deployment.
- [ ] **`.env` in `.gitignore`.** Verify it's ignored and never appears in `git log`.
- [ ] **Remove any temporary sync-trigger code** (e.g. `CommandLineRunner`) before deployment.

### Code quality
- [ ] **`spring.jpa.show-sql: false`.** Test output is currently dominated by Hibernate SQL logging.
- [ ] **`spring.jpa.open-in-view: false`.** Spring warns about this on every startup. Recommended default for API-only apps.
- [ ] **`@ColumnDefault` cleanups.** Redundant on primitive `boolean` fields.

## Further Work (Post-Frontend)

- Alerts (kickoff notifications, clash warnings)
- Calendar export (iCal / Google Calendar integration)
- Historical stats (streaks, head-to-head records)
- User-followed team management UI
- Deployment to Railway or Fly.io
