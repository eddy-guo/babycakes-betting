from flask import Flask, jsonify, request
from nba_api.stats.endpoints import playergamelog
from nba_api.stats.static import players

import pandas as pd

app = Flask(__name__)

player = players.get_players()
jokic = [x for x in player if x["full_name"] == "Nikola Jokic"][0]
murray = [x for x in player if x["full_name"] == "Jamal Murray"][0]

@app.route('/api/stats')
def create_gamelog():
        name = request.args.get("name")
        season = request.args.get("season")
        season_type = request.args.get("season_type")
        
        id = [x for x in player if x["full_name"] == name][0]["id"]
        
        data = playergamelog.PlayerGameLog(player_id=id, season=season, season_type_all_star=season_type).get_data_frames()[0]
        # popular_stats = pd.DataFrame(data=data[0], columns=("MIN", "PTS", "REB", "AST", "STL", "BLK"))
        if data.empty:
             return jsonify({'Error': 'Stats do not exist.'}), 404
        response = data.to_dict() # orient="records"
        return jsonify(response), 200, {'Access-Control-Allow-Origin': '*'}

if __name__ == '__main__':
    app.run(debug=True)

# add to indexjs
# start indexjs input values (frontend)

'''
jokic_rs = pd.concat(create_gamelog(jokic["id"], ["2022", "2023"], "Regular Season").get_data_frames())
jokic_po = pd.concat(create_gamelog(jokic["id"], ["2022", "2023"], "Playoffs").get_data_frames())

jokic_rs_stats = pd.DataFrame(data=jokic_rs, columns=("MIN", "PTS", "REB", "AST", "STL", "BLK"))
jokic_po_stats = pd.DataFrame(data=jokic_po, columns=("MIN", "PTS", "REB", "AST", "STL", "BLK"))

jokic_rs_average = jokic_rs_stats.mean(axis="index")
jokic_po_average = jokic_po_stats.mean(axis="index")

jokic_rs_over30 = jokic_rs_stats[jokic_rs_stats["PTS"] >= 30]
jokic_po_over30 = jokic_po_stats[jokic_po_stats["PTS"] >= 30]
'''