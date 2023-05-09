from nba_api.stats.endpoints import LeagueGameFinder
from datetime import datetime

now = datetime.now().strftime("%m/%d/%Y")

def getGameStats(id, date):
    game = LeagueGameFinder(date_from_nullable=date, date_to_nullable=date, player_id_nullable=id, league_id_nullable='00')
    if game.get_data_frames()[0].empty:
        print("Player did not play this day.")
    return game.get_data_frames()[0]

jokic_may7 = getGameStats(203999, "05/07/2023")

