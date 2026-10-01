# Roadmap

Planned work, known technical debt, and design proposals for Sports Conflict Tracker.

## Next Steps

- [ ] Frontend (Vite + React + TypeScript + Tailwind)
- [ ] Deployment setup (Railway or Fly.io)
- [ ] Alerts and calendar export
- [ ] Historical stats integration

## Frontend Roadmap

### Phase 1: UI/UX Design

- [ ] Core screen wireframes
- [ ] App navigation hierarchy
- [ ] Fixture card layout (score and reasoning display)
- [ ] Visual representation of overlapping kickoff times
- [ ] Design system setup (palette, typography)

### Phase 2: Setup & Scaffolding

- [ ] Initialize Vite + React + TypeScript
- [ ] Configure Tailwind CSS
- [ ] Setup React Router
- [ ] Configure ESLint + Prettier
- [ ] Project directory setup (`pages/`, `components/`, `api/`, `types/`, `hooks/`)

### Phase 3: Authentication

- [ ] Login screen (`POST /api/users/login`, JWT persistence)
- [ ] Register screen (`POST /api/users/register`)
- [ ] HTTP client interceptors for `Authorization` header injection
- [ ] Auth guards for protected routes

### Phase 4: Core Views

- [ ] Scored fixture list view (`GET /api/fixtures/scored`)
- [ ] League filtering (`?league=NBA`)
- [ ] Priority sorting
- [ ] Fixture detail modal / page with score breakdown
- [ ] Loading, error, and empty states

### Phase 5: Team Preferences

- [ ] Team selection interface (`GET /api/teams`)
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
- [ ] Backend CORS configuration
- [ ] Production deployment to Railway / Fly.io

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
