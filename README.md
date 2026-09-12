# Sports Conflict Tracker

Detects fixture clashes across your followed sports teams and scores which one to watch, with reasoning.

## What it does

You follow teams across multiple leagues. Sometimes two of them play at the same time. This app detects those clashes, scores which fixture matters more using a set of weighted rules (rivalry, playoff implications, current form, home/away), and explains *why*. Not just which score is higher, but the reasoning behind it.

Conflict resolution is the core of the app. Built around it: team dashboards, kickoff alerts, calendar export, and historical stats (streaks, head-to-head records) across your followed teams.

## Stack

- **Backend:** Java 21, Spring Boot, Postgres, Flyway
- **Frontend:** TypeScript, Tailwind CSS
- **Data:** BALLDONTLIE (NBA/NFL/MLB) and Football-Data.org (EPL)
- **Infra:** Docker, GitHub Actions, deployed on Railway/Fly.io

## Architecture

```
backend/
├── model/      : domain records (Team, Fixture, ConflictScore)
├── rules/      : ImportanceRule interface + implementations (rivalry, playoffs, streaks, home/away)
├── engine/     : ConflictEngine, aggregates rule outputs into a score
├── entity/     : JPA entities (persistence layer, separate from domain model)
├── repository/ : Spring Data JPA repositories
├── dto/        : API request/response shapes
├── service/    : orchestration layer
└── controller/ : REST endpoints

frontend/       : TypeScript + Tailwind UI
```

The rule engine is pure Java with no framework dependency. It can be tested in isolation and doesn't know or care that Spring, Postgres, or a frontend exist. Spring is layered around it, not through it.

## Status

🚧 In development.

- [x] Project scaffolding, JDK/Maven/JUnit toolchain
- [x] Domain model + rule engine (pure Java, tested independently of Spring)
- [x] Postgres schema + Flyway migrations
- [x] Spring Boot setup, JPA entities, repositories, initial REST endpoints
- [x] Live BALLDONTLIE integration — real NBA team data fetched and persisted
- [ ] DTOs + auth (registration/login)
- [ ] Remaining league integrations (NFL, MLB, EPL)
- [ ] Frontend
- [ ] Deployment
- [ ] Auth
- [ ] Alerts + calendar export
- [ ] Historical stats (streaks, head-to-head)

## Setup

_Instructions coming once the app is runnable end to end._
