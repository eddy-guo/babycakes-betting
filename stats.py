from nba_api.stats.endpoints import playergamelog
from nba_api.stats.static import players
import pandas as pd

player = players.get_players()

jokic = [x for x in player if x["full_name"] == "Nikola Jokic"][0]
murray = [x for x in player if x["full_name"] == "Jamal Murray"][0]

def createGamelog(id, season, type):
    return playergamelog.PlayerGameLog(player_id=id, season=season, season_type_all_star=type)

jokic_rs = pd.concat(createGamelog(jokic["id"], ["2022", "2023"], "Regular Season").get_data_frames())
jokic_po = pd.concat(createGamelog(jokic["id"], ["2022", "2023"], "Playoffs").get_data_frames())

jokic_rs_stats = pd.DataFrame(data=jokic_rs, columns=("MIN", "PTS", "REB", "AST", "STL", "BLK"))
jokic_po_stats = pd.DataFrame(data=jokic_po, columns=("MIN", "PTS", "REB", "AST", "STL", "BLK"))

jokic_rs_average = jokic_rs_stats.mean(axis="index")
jokic_po_average = jokic_po_stats.mean(axis="index")

jokic_rs_over30 = jokic_rs_stats[jokic_rs_stats["PTS"] >= 30]
jokic_po_over30 = jokic_po_stats[jokic_po_stats["PTS"] >= 30]
