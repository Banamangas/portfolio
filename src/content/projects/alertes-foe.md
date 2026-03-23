---
title: "Alertes FoE"
subtitle: "Scheduled Discord announcement bot for recurring Forge of Empires guild events"
date: 2024-09-01
tags: [Python, Discord.py, APScheduler, Flask, pytz]
thumbnail: "/images/projects/alertes-foe.png"
github: "https://github.com/Banamangas/alertes-foe"
featured: false
stats:
  - label: "Python Lines"
    value: "~1,050"
  - label: "Message Types"
    value: "4"
  - label: "Catch-up Window"
    value: "2 hours"
  - label: "Deployment"
    value: "Render.com"
---

A Discord bot that sends automated, timezone-aware announcements to a guild server on a fixed weekly schedule. It handles three recurring event types, alternates message content on even/odd ISO weeks, and recovers gracefully if it was offline at the scheduled time.

## The Problem

Guild officers had to manually post reminder messages for recurring weekly events — often forgetting, posting at the wrong time, or sending inconsistent content. Events like Quantum Incursions alternate behaviour every two weeks (even/odd ISO week), adding another layer of error-prone manual tracking.

## Scheduled Message Engine

Three recurring schedules, all in Paris timezone with automatic DST handling:

| Day | Time | Event |
|-----|------|-------|
| Thursday | 7:55 AM | Quantum Incursion (even/odd week variant) |
| Tuesday | 8:00 AM | Guild Battles |
| Sunday | 6:00 PM | Weekly recap |

### Even/Odd Week Alternation

Thursday messages vary based on ISO week number parity. The bot computes `datetime.isocalendar().week % 2` at send time — no manual tracking needed.

### Catch-Up Mechanism

If the bot was offline at 7:55 AM on Thursday, it retries the message any time before 10:00 AM that day. A `sent_dates.json` file persists send history across restarts to prevent duplicates.

## Technical Highlights

**Critical bug fix — language inconsistency:** The original codebase mixed French and English day names in the same comparison chain, causing Thursday messages to silently fail. Fixed by centralising all day name mappings in a `DayMapping` class.

**Class-based refactor:** Restructured from a monolithic script into focused classes — `Config`, `DayMapping`, `MessageThemes`, `ScheduledMessenger` — each with a single responsibility.

**Keep-alive pattern:** A minimal Flask server responds to HTTP pings to prevent Render.com's free tier from sleeping the dyno between scheduled runs.
