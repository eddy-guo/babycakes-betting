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

    if name not in [player["full_name"] for player in player]:
        return jsonify({'Error': 'Invalid name.'})
    if not season.isdigit():
        return jsonify({'Error': 'Invalid season.'})
    if season_type not in ["Regular Season", "Playoffs", "Pre Season", "All-Star", "All Star"]:
        return jsonify({'Error': 'Invalid season type.'})

    id = [x for x in player if x["full_name"] == name][0]["id"]

    data = playergamelog.PlayerGameLog(
        player_id=id, season=season, season_type_all_star=season_type).get_data_frames()[0]
    if data.empty:
        return jsonify({'Error': 'Stats do not exist.'})
    response = data.to_dict()  # orient="records"
    return jsonify(response), 200, {'Access-Control-Allow-Origin': '*'}

@app.route('/api/livegameid')
def temp():
    games = scoreboard.ScoreBoard()
    # args go here(?)

    live = ["0042200226", "0042200216"]  # TODO: Remove hardcode

    if games.get_dict()["scoreboard"]["games"]:
        for games in games.get_dict()["scoreboard"]["games"]:
            if games["gameStatusText"] != "Final":
                live.append(games["gameId"])
    # TEMP, no games live during testing (boxscorejs also needs change)
    return live


if __name__ == '__main__':
    app.run(debug=True)
