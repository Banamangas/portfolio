---
title: "FoE Building Analyzer"
subtitle: "Interactive Streamlit web app for analyzing and comparing Forge of Empires buildings"
date: 2025-03-01
tags: [Python, Streamlit, Pandas, NumPy, Plotly, AG-Grid, Pillow]
thumbnail: "/images/projects/foe-building-analyzer.png"
live: "https://foe-buildings-database.streamlit.app/"
featured: true
stats:
  - label: "Python Lines"
    value: "~5,300"
  - label: "Weightable Columns"
    value: "41"
  - label: "Eras Supported"
    value: "22"
  - label: "Languages"
    value: "EN / FR"
---

A data-driven web application that lets Forge of Empires players filter, compare, and score any of the game's 1,000+ buildings across 22 eras. It connects to the VPS REST API, applies a customizable weighted efficiency model, and renders the results in an interactive data grid with visualizations.

## The Problem

Forge of Empires has 1,082 buildings, each with up to 22 era variants and 80+ attributes — production rates, boost percentages, consumables, military output. Players had no tool to answer questions like *"which buildings give the most value per tile for my current city setup?"* Comparing even a handful of buildings manually is impractical.

## Weighted Efficiency Calculator

The core feature: a three-step pipeline that converts every building's attributes to a single comparable score.

| Step | What it does |
|------|-------------|
| **Boost application** | Applies the player's city production context + each building's self-boost to raw values |
| **Base reversal** | Reverses combined boost percentages back to true base values |
| **Weighted sum** | Multiplies each column's value by the player's custom weight and sums the result |

41 columns are weightable. The result is a direct, real-value score — no normalisation artifacts. Boost buildings are automatically converted from percentages to equivalent production based on the player's actual city context.

## Interactive Data Grid

AG-Grid renders the filtered, scored dataset with column group presets, sorting, pagination, range and categorical filters with AND/OR logic, heatmap colouring, and CSV/JSON export.

## City Analysis

Players can paste their in-game building inventory to receive personalised replacement recommendations ranked by weighted efficiency gain.

## Technical Highlights

**Direct weighted sum (no normalisation):** Most scoring systems normalise values to [0,1], which distorts comparisons. This calculator uses absolute production values so a 10% boost on 1,000 FP/day means exactly 100 FP/day in the score.

**Session-persisted state:** All user preferences (language, filters, weights, city context) persist across Streamlit reruns via session state.

**Dual-layer image handling:** Building icons are resolved via ForgeHX CDN hash maps, base64-encoded, and LRU-cached for inline rendering in the grid.
