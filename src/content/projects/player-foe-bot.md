---
title: "Player FoE Bot"
subtitle: "Discord bot for real-time player and guild leaderboards across all 24 French FoE servers"
date: 2025-01-01
tags: [Python, Discord.py, BeautifulSoup, Pandas, SQLite, APScheduler, Plotly]
thumbnail: "/images/projects/player-foe-bot.png"
github: "https://github.com/Banamangas/player_foe_bot"
featured: false
stats:
  - label: "Servers Monitored"
    value: "24"
  - label: "Database Size"
    value: "~354 MB"
  - label: "History Retention"
    value: "7 days"
  - label: "Python Lines"
    value: "~1,020"
---

A Discord bot that scrapes player rankings from all 24 French Forge of Empires servers daily, stores them in SQLite, and exposes slash commands for leaderboard queries with 24-hour progression diffs. Players can look up any player's current rank and stats, or see who gained the most battles or points in the last 24 hours — across any server or all servers combined.

## The Problem

FoE leaderboard data is scattered across 24 separate server pages on a third-party site. There was no way to query cross-server rankings, see 24-hour progression, or look up a specific player without manually browsing multiple pages.

## Automated Daily Scraper

Every day at 6:00 AM (Paris time), the bot fetches all 24 French servers in parallel using `ThreadPoolExecutor`. For each server, it requests the rankings page, parses the HTML table with BeautifulSoup, loads it into a Pandas DataFrame, and writes to SQLite. The source API already provides 24-hour diffs (`pointsDif`, `battlesDif`) which are stored alongside each snapshot.

## Discord Commands

| Command | What it does |
|---------|-------------|
| `/player <name> <server>` | Full profile: rank, era, guild, points, battles, 24h diffs |
| `/top_battles [limit] [server]` | Top players by 24h battle gain |
| `/top_points [limit] [server]` | Top players by 24h point gain |
| `/top_guilds [limit] [server]` | Top guilds by total 24h battles |
| `/scan` | Admin-only manual trigger for a full scrape |

## Technical Highlights

**Multi-server parallel fetching:** All 24 servers are fetched concurrently via `ThreadPoolExecutor`. Each thread is independent, so a single failing server doesn't block the others.

**SQLite indexing strategy:** Four indexes chosen to match the bot's query patterns — `server`, `name`, `(player_id, server)`, and `snapshot_date`. Lookups stay fast even as the history table grows.

**7-day retention policy:** History rows older than 7 days are automatically deleted after each scrape, keeping database size bounded.

**DTYPE enforcement:** Pandas infers SQLite column types from Python types, which can cause INTEGER overflow on large FP point values. All numeric columns are explicitly typed at write time to prevent silent truncation.

**Timezone-aware scheduling:** APScheduler is configured with `Europe/Paris` timezone so the 6:00 AM trigger adjusts correctly for DST transitions.
