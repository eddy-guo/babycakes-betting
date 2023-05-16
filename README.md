# Babycakes Betting

## Potential improvements
- stats showing over/under, previous games, previous matchup games, etc.
  - difficult, cannot use pandas as effectively; need to parse json file efficiently
  - visuals (bar graph, percentages, etc.)
- api consists of flask api (stats.py), external api (api/boxscore.js)
  - unorganized implementation with boxscore using livegameid from stats to get boxscore from nba api; can fetch nba api in flask api instead, keep everything on flask server(?)
- live update full implementation
  - cron or create webhook(!) to continue live updates; simple