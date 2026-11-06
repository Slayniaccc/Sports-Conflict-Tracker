# Roadmap

Planned work, known technical debt, and design proposals for Sports Conflict Tracker.

## Next Steps

- [x] Frontend (Vite + React + TypeScript + Tailwind)
- [ ] Deployment setup (Railway or Fly.io)
- [ ] Alerts and calendar export
- [ ] Historical stats integration

## Current Focus (in order)

1. [x] **Team pages**: `GET /api/teams/{id}` plus `/teams/:id` page, linked from fixture pages
2. [ ] **Readable reasoning**: "Home court (+5)", "Your team is playing (+15)" instead of
   `HomeAdvantageRule: +5. FavoriteTeamRule: +15`. Also decide whether home advantage means
   "home team" (current) or "your team is at home"
3. [ ] **Rivalries table**: move the hardcoded list into Postgres with intensity
   (see Stake Model below). Lakers vs Clippers currently gets no rivalry bonus
4. [ ] **Profile page**: set and change favourite team in the app (currently only via `curl`)
5. [ ] **Redesign**: see Phase 1 and the Redesign section below
6. [ ] **Post-MVP**: user-defined rule weightings (new table, migration, settings UI), so users
   can say rivalries matter twice as much as home advantage

## Frontend Roadmap

### Phase 1: UI/UX Design

- [ ] Core screen wireframes
- [ ] App navigation hierarchy
- [ ] Fixture card layout (score and reasoning display)
- [ ] Visual representation of overlapping kickoff times
- [ ] Design system setup (palette, typography)

### Phase 2: Setup & Scaffolding

- [x] Initialize Vite + React + TypeScript
- [x] Configure Tailwind CSS
- [x] Setup React Router
- [ ] Configure ESLint + Prettier (ESLint done, Prettier not yet)
- [x] Project directory setup (`pages/`, `components/`, `api/`, `types/`, `lib/`, `contexts/`)

### Phase 3: Authentication

- [x] Login screen (`POST /api/users/login`, JWT persistence)
- [x] Register screen (`POST /api/users/register`)
- [x] `Authorization` header injection (`authHeaders()` in `api/config.ts`)
- [ ] Auth guards for protected routes

### Phase 4: Core Views

- [x] Scored fixture list view (`GET /api/fixtures/scored`)
- [x] League filtering (`?league=NBA`)
- [ ] Priority sorting
- [x] Fixture detail page with score breakdown
- [x] Team detail page (`/teams/:id`) with upcoming and played fixtures
- [x] Loading, error, and empty states

### Phase 5: Team Preferences

- [x] Favourite team in the backend (`PUT /api/users/me/favorite-team`, +15 scoring bonus)
- [ ] Team selection interface (`GET /api/teams`) on a profile page
- [ ] Follow/unfollow team actions
- [ ] Personalised fixture feed filtered by followed teams
- [ ] Clash visualization for overlapping match times

### Phase 6: Interface Refinements

- [ ] Layout responsiveness
- [ ] Dark theme support
- [ ] Skeleton loading states
- [ ] Global error boundary and toast notifications

### Phase 7: Deployment

- [ ] Frontend deployment (Vercel / Netlify)
- [ ] Environment variable mapping
- [x] Backend CORS configuration (in the security chain, so browser preflight works)
- [ ] Production CORS origins (currently `localhost:5173` only)
- [ ] Commit a `.env.example` listing required variables
- [ ] Production deployment to Railway / Fly.io

## Redesign

Inspiration: dark live-scores style (near-black, single lime accent, thin-bordered panels,
uppercase tracked labels, mono numerals, competitions sidebar with colour squares).
Built around the conflict score rather than copied as a live-scores app.

- [ ] Design tokens in `index.css` (Tailwind v4 `@theme`)
- [ ] Typography: Inter in multiple weights (Bold headlines, Semibold card titles and badges,
      Regular body and reasoning) plus a mono font for scores and times.
      Open question: one condensed display font for headlines only
- [ ] Sport-specific accent colours in the sidebar and sport icons next to leagues
- [ ] Hover effects on cards instead of cursor changes
- [ ] Hero panel: today's top-scored fixture with its reasoning
- [ ] No fake data: scores, team colours and standings need backend work first
  - [ ] Scores and match status (see "Fixture status and live scores" below)
  - [ ] Team colour column on `TeamEntity`
  - [ ] Standings and form via Football-Data.org

## Backend Maintenance & Technical Debt

### Refactoring

- [ ] Extract `TeamService` from `TeamController` (constructor has 8 parameters)
- [ ] Move `FixtureDetail`'s inline `fetch` into `getScoredFixture(id)` in `api/fixtures.ts`
- [ ] Consistent JSON field naming (`is_Verified`, `created_at` vs `id`, `email`)

### Reliability

- [ ] Global rate limiter (resolve concurrent sync 429 errors; sync tests hit them when run back to back)
- [ ] Mock external APIs in sync tests instead of calling them live
- [ ] Test DB isolation (decouple tests from dev DB)
- [ ] Transactional test wrappers
- [ ] Test environment config (`src/test/resources/application-test.yml`)
- [ ] Cross-league integrity tests

### Schema & Data Access

- [ ] Standardize `team.external_id` (varchar 50) and `fixture.external_id` (varchar 255)
- [ ] Resolve N+1 queries on fixture reads (`JOIN FETCH` / `@EntityGraph`)

### Security

- [ ] Review `SecurityConfig` `permitAll` rules: `/api/fixtures/scored/**` and `GET /api/teams/**`
      are now public on purpose (logged-out users get base scores), confirm nothing else leaks
- [ ] API key rotation and `.env` verification

### Code Quality

- [ ] Disable `spring.jpa.open-in-view`
- [ ] Disable `spring.jpa.show-sql` for production profiles
- [ ] Implement `equals`/`hashCode` for `TeamEntity` and `AppUserEntity`
- [ ] Clean up redundant root-level `src/` directory

## Proposed Design: Stake Model

The current boolean flags (`isRivalry`, `isPlayoffImplication`) do not fit European formats (e.g., Premier League title races, European qualification spots, relegation battles).

Planned refactor: replace booleans with a unified `FixtureStakes` enum on `FixtureEntity`:
`NONE` | `RIVALRY` | `PLAYOFF` | `TITLE_RACE` | `EUROPEAN_QUAL` | `RELEGATION`

- Store rivalry definitions in a dedicated `rivalry` table (`league`, `team_a_id`, `team_b_id`, `intensity`, `note`).
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

Unblocks: StatusBadge FT/LIVE branches, score rendering in TeamRow, honest
past-fixture filtering, header accuracy.
