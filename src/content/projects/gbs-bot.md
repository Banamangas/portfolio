---
title: "Great Buildings Bot"
subtitle: "Discord slash-command bot for Great Building lookups and FP investment ROI analysis"
date: 2024-11-01
tags: [Python, Discord.py, Flask, difflib]
thumbnail: "/images/projects/gbs-bot.png"
github: "https://github.com/Banamangas/gbs_bot"
featured: false
stats:
  - label: "Python Lines"
    value: "~1,480"
  - label: "Slash Commands"
    value: "4"
  - label: "GB Database"
    value: "4.1 MB JSON"
  - label: "Languages"
    value: "EN / FR"
---

A Discord bot that gives Forge of Empires players instant access to Great Building statistics and investment profitability calculations. Players can look up any GB's level costs and rewards, then run an ROI analysis across a level range at a custom FP value ratio — directly from Discord, with interactive buttons for deeper exploration.

## The Problem

Great Buildings are the endgame progression mechanic in FoE. Whether a given FP investment is profitable depends on the FP value ratio your guild uses — a metric that changes over time. Players had to use external spreadsheets or mental arithmetic to evaluate positions. There was no fast, in-Discord tool.

## Commands

| Command | What it does |
|---------|-------------|
| `/gb <name>` | Looks up a GB: age, size, build cost, description |
| `/gb_list [age]` | Lists all GBs, optionally filtered by age |
| `/gb_level <name> <level>` | Level cost and rewards with Previous/Next buttons |
| `/invest <gb> <from> <to> [ratio]` | ROI analysis across a level range with position comparison |

All GB names support autocomplete with fuzzy matching.

## Investment Calculator

The `/invest` command computes profitability for every reward position at each level in a range:

```
Net Profit = (Total Reward FP × Ratio) - Total Level Cost
ROI % = (Net Profit / Total Level Cost) × 100
```

Results are colour-coded in Discord embeds (green = profit, red = loss) and ranked by ROI. The FP ratio defaults to 1.9 but can be overridden via a Discord modal (0.0–2.0 range).

## Technical Highlights

**Fuzzy matching:** GB names are matched with `difflib.get_close_matches(cutoff=0.6)`, so typos like `/gb coliseum` still resolve to "The Colosseum" correctly.

**Interactive Discord UI:** `GBLevelView` and `InvestmentView` subclass `discord.ui.View` with button callbacks and a 300-second timeout. State (current level, position) is held in the view object, so Previous/Next buttons update in-place without re-querying.

**Clean data layer:** All GB data lives in a single JSON file. The `GBData` class wraps it with query methods, keeping the command handlers thin and testable.
