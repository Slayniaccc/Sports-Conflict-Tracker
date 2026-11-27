# Roadmap

Planned work, known technical debt, and design proposals for Sports Conflict Tracker.

## Next Steps

- [x] Frontend (Vite + React + TypeScript + Tailwind)
- [ ] Deployment setup (Railway or Fly.io)
- [ ] Alerts and calendar export
- [ ] Historical stats integration

## Done

- [x] Team pages: `GET /api/teams/{id}` plus `/teams/:id`
- [x] Readable reasoning: labelled factors such as "Home court", "Your team travels"
- [x] Rivalries table with intensity and names, loaded into `RivalryLookup`
- [x] Frontend redesign (PR #9)
- [x] Environment-independent tests: live-API tests opt-in, Testcontainers for the repository test (PR #8)

## Current Focus (in order)

1. [ ] **Account page**: favourite team picker (`GET /api/teams`, `PUT /api/users/me/favorite-team`), sign out,
       and automatic sign-out when the token expires or the API returns 401
2. [ ] **Scores and results**: store home/away scores and match status; a small refresh sync for recent and live games,
       separate from the season sync
3. [ ] **Form and momentum**: last-five results and streaks, computed from stored results; a `FormRule`
4. [ ] **Standings and stakes**: league position (computed, or Football-Data standings for EPL); a `StakeRule`
       for title races, top four and relegation. Replaces the playoff flag nothing sets today
5. [ ] **Player rivalries**: hand-curated table plus player stats; check each provider's free tier first
6. [ ] **Richer reasoning**: templates from the new factors; optionally an AI rewrite of true facts only,
       generated server-side, cached, with a template fallback
7. [ ] **Post-MVP**: user-defined rule weightings (new table, migration, settings UI)

## Frontend Roadmap

### Phase 1: UI/UX Design

- [x] Core screen wireframes
- [x] App navigation hierarchy
- [x] Fixture card layout (score and reasoning display)
- [x] Visual representation of overlapping kickoff times
- [x] Design system setup (palette, typography)

### Phase 2: Setup & Scaffolding

- [x] Initialize Vite + React + TypeScript
- [x] Configure Tailwind CSS
- [x] Setup React Router
- [ ] Configure Prettier (ESLint done and lint-clean)
- [x] Project directory setup (`pages/`, `components/`, `api/`, `types/`, `lib/`, `contexts/`)

### Phase 3: Authentication

- [x] Login screen (`POST /api/users/login`, JWT persistence)
- [x] Register screen (`POST /api/users/register`)
- [x] `Authorization` header injection (`authHeaders()` in `api/config.ts`)
- [ ] Auth guards for protected routes

### Phase 4: Core Views

- [x] Scored fixture list view (`GET /api/fixtures/scored`)
- [x] League filtering (`?league=NBA`)
- [x] Priority sorting
- [x] Fixture detail page with score breakdown
- [x] Team detail page (`/teams/:id`) with upcoming and played fixtures
- [x] Loading, error, and empty states

### Phase 5: Team Preferences

- [x] Favourite team in the backend (`PUT /api/users/me/favorite-team`, +15 scoring bonus)
- [ ] Team selection interface (`GET /api/teams`) on a profile page
- [ ] Follow/unfollow team actions
- [ ] Personalised fixture feed filtered by followed teams
- [x] Clash visualization for overlapping match times

### Phase 6: Interface Refinements

- [x] Layout responsiveness
- [x] Dark theme support
- [x] Skeleton loading states
- [ ] Global error boundary and toast notifications

### Phase 7: Deployment

- [ ] Frontend deployment (Vercel / Netlify)
- [ ] Environment variable mapping
- [x] Backend CORS configuration (in the security chain, so browser preflight works)
- [ ] Production CORS origins (currently `localhost:5173` only)
- [ ] Commit a `.env.example` listing required variables
- [ ] Production deployment to Railway / Fly.io

## Redesign (done, PR #9)

Dark live-scores style built around the conflict score: near-black background, a single lime accent,
thin-bordered panels, uppercase tracked labels, mono numerals.

- [x] Design tokens in `index.css` (Tailwind v4 `@theme`) and Fontsource fonts (Anton, Inter, JetBrains Mono)
- [x] League tabs with colour swatches, day strip, hero top pick, ranked day groups, clash tags
- [x] Fixture page: score breakdown, clash card, planned modules preview
- [x] Team page: next five plus "show all", recently played, next game and big games
- [x] Hover states, skeletons, entrance animations, sticky side columns
- [ ] Team colours (needs a colour column on `TeamEntity`)
- [ ] Real data for the planned modules: momentum, league table and form, scorers (see Current Focus)

## Testing & CI

- [ ] Frontend tests: Vitest and React Testing Library
  - [ ] `lib/` helpers first: `findClashes`, `buildWeek`, `dayHeading`, `groupByDay`, `scoreTier`, `teamAbbr`, `teamShort`, `matchupText`
  - [ ] Components: `FixtureRow` (your team, clash tag), team page "show all"
- [ ] Run `npm run lint`, `npm run build` and frontend tests in CI
- [ ] Make CI dependency downloads more reliable (Maven Central returned 429 on a run after PR #9)

## Backend Maintenance & Technical Debt

### Refactoring

- [ ] Extract `TeamService` from `TeamController` (constructor has 8 parameters)
- [x] Move `FixtureDetail`'s inline `fetch` into `getScoredFixture(id)` in `api/fixtures.ts`
- [ ] Consistent JSON field naming (`is_Verified`, `created_at` vs `id`, `email`)

### Reliability

- [ ] Global rate limiter (resolve concurrent sync 429 errors; sync tests hit them when run back to back)
- [ ] Mock external APIs in sync tests instead of calling them live
- [ ] Test DB isolation (decouple tests from dev DB)
- [ ] Transactional test wrappers
- [x] Test environment config (`src/test/resources/application-test.yml`)
- [ ] Reload rivalries without a restart (`feat/rivalry-reload`: atomic map swap plus scheduled refresh)
- [ ] Re-enable a between-page delay for BALLDONTLIE syncs (`INTER_PAGE_DELAY_MS` is 0)
- [ ] Cross-league integrity tests

### Schema & Data Access

- [ ] Standardize `team.external_id` (varchar 50) and `fixture.external_id` (varchar 255)
- [ ] Resolve N+1 queries on fixture reads (`JOIN FETCH` / `@EntityGraph`). Confirmed in `show-sql`
      logs: one fixture query, then one team query per team

### Security

- [ ] Review `SecurityConfig` `permitAll` rules: `/api/fixtures/scored/**` and `GET /api/teams/**`
      are now public on purpose (logged-out users get base scores), confirm nothing else leaks
- [ ] API key rotation and `.env` verification

### Code Quality

- [ ] Disable `spring.jpa.open-in-view`
- [ ] Disable `spring.jpa.show-sql` for production profiles
- [ ] Implement `equals`/`hashCode` for `TeamEntity` and `AppUserEntity`
- [ ] Clean up redundant root-level `src/` directory
- [ ] Return 404 instead of `RuntimeException` (500) for missing teams and users
- [ ] Favourite-team check compares `externalId` only; include league (NBA/NFL ids can collide)
- [ ] Add endpoints for NFL and MLB team sync (service methods exist, only tests call them)
- [ ] Remove or use `UserFollowedTeamEntity` (not referenced by app code)
- [ ] Turn off Spring Security DEBUG logging outside development

## Proposed Design: Stake Model

The current boolean flags (`isRivalry`, `isPlayoffImplication`) do not fit European formats (e.g., Premier League title races, European qualification spots, relegation battles).

Planned refactor: replace booleans with a unified `FixtureStakes` enum on `FixtureEntity`:
`NONE` | `RIVALRY` | `PLAYOFF` | `TITLE_RACE` | `EUROPEAN_QUAL` | `RELEGATION`

- [x] Rivalry definitions now live in a `rivalry` table (`league`, `team_a`, `team_b`, `intensity`, `note`), keyed by team name
- Implement standalone stake detection engines per league type.

## Future Enhancements

- Kickoff notifications and clash alerts
- Calendar synchronization (iCal / Google Calendar)
- Historical head-to-head statistics
- Rule scores that vary by stage of season (an October game shouldn't weigh the same as a postseason one)
- Not planned yet: messaging or chat (would need new tables, WebSockets, permissions)

### Fixture status and live scores

`/api/fixtures/scored` returns no status and no scores, so the frontend
hardcodes `status: "upcoming"` and the FT/LIVE branches of StatusBadge are
unreachable.

Split by nature of the data:

- **Derived at read time** — the `upcoming | live | ft` label, computed in the
  response DTO from `kickoff` vs now plus a per-league duration (NBA ~2.5h,
  NFL ~3.5h, MLB ~3h, EPL ~2h). No column, no migration; a stored status
  column would go stale immediately since status is a function of time.
  Approximate by nature — overtime and delays break the window.
- **Stored, needs a refresh sync** — `homeScore`, `awayScore` and the
  provider's own status. BallDontLie already returns `status_state`,
  `home_team_score`, `visitor_team_score`; our DTOs drop them. Scores can't
  be derived, and the current sync is one-shot, so this needs a second
  narrow sync over games near now (frequent, cheap, UPDATE not INSERT) as
  distinct from the bulk season sync (rare, 2:47, heavy quota).

Unblocks: final scores on fixture rows and the team page, honest "recently played" with results,
and form and momentum (see Current Focus).
