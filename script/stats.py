from flask import Flask, jsonify, request
from nba_api.stats.endpoints import playergamelog
from nba_api.stats.static import players
from nba_api.live.nba.endpoints import scoreboard

import pandas as pd

app = Flask(__name__)

player = players.get_players()


@app.route('/api/stats')
def create_gamelog():
    name = request.args.get("name")
    season = request.args.get("season")
    season_type = request.args.get("season_type")

    id = [x for x in player if x["full_name"] == name][0]["id"]

    data = playergamelog.PlayerGameLog(
        player_id=id, season=season, season_type_all_star=season_type).get_data_frames()[0]
    if data.empty:
        return jsonify({'Error': 'Stats do not exist.'}), 404
    response = data.to_dict()  # orient="records"
    return jsonify(response), 200, {'Access-Control-Allow-Origin': '*'}


@app.route('/api/over30')
def create_gamelog_over30():
    name = request.args.get("name")
    season = request.args.get("season")
    season_type = request.args.get("season_type")

    id = [x for x in player if x["full_name"] == name][0]["id"]

    data = playergamelog.PlayerGameLog(
        player_id=id, season=season, season_type_all_star=season_type).get_data_frames()[0]
    if data.empty:
        return jsonify({'Error': 'Stats do not exist.'}), 404
    data_over30 = data[data["PTS"] >= 30]
    response = data_over30.to_dict()  # orient="records"
    return jsonify(response), 200, {'Access-Control-Allow-Origin': '*'}


@app.route('/api/live')
def temp():
    games = scoreboard.ScoreBoard()
    # args go here(?)

    live = []

    if not games.get_dict()["scoreboard"]["games"]:
        return "No games playing currently."
    else:
        for games in games.get_dict()["scoreboard"]["games"]:
            if games["gameStatusText"] != "Final":
                live.append(games["gameId"])
    return live


if __name__ == '__main__':
    app.run(port=8000, debug=True)

# LIVE:
# live game id from temp -> boxscore
# input box for player name

# STATS:
# over/under specific number (go back to pandas, but how to populate?)
    # make multiple endpoints, return different things
    # more specific regarding past games, playoff games, matchup against, etc
# visuals (lol)
