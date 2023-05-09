from flask import Flask, jsonify, request
from nba_api.stats.endpoints import LeagueGameFinder
from datetime import datetime

import json

app = Flask(__name__)

now = datetime.now().strftime("%m/%d/%Y")

@app.route('/api/game-stats')
def get_game_stats():
    id = request.args.get("id")
    date = request.args.get("date")
    game = LeagueGameFinder(date_from_nullable=date, date_to_nullable=date, player_id_nullable=id, league_id_nullable='00')
    if game.get_data_frames()[0].empty:
        return jsonify({'error': 'Player and game date does not match.'}), 404
    response = game.get_data_frames()[0].to_dict(orient="records")
    return jsonify(response), 200, {'Access-Control-Allow-Origin': '*'}

if __name__ == '__main__':
    app.run(debug=True)
