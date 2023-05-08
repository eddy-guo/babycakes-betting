from nba_api.stats.endpoints import playercareerstats, playergamelog
from nba_api.stats.static import players

player = players.get_active_players()

jokic = [x for x in player if x["full_name"] == "Nikola Jokic"][0]
murray = [x for x in player if x["full_name"] == "Jamal Murray"][0]

def createGamelog(id, season, type):
    return playergamelog.PlayerGameLog(player_id=id, season=season, season_type_all_star=type)

jokicRegularSeason = createGamelog(jokic["id"], ["2022", "2023"], "Regular Season")
jokicPlayoffs = createGamelog(jokic["id"], ["2022", "2023"], "Playoffs")
murrayRegularSeason = createGamelog(murray["id"], ["2022", "2023"], "Regular Season")
murrayPlayoffs = createGamelog(murray["id"], ["2022", "2023"], "Playoffs")

jokicCareer = playercareerstats.PlayerCareerStats(player_id=jokic["id"])
murrayCareer = playercareerstats.PlayerCareerStats(player_id=murray["id"])
