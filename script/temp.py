from nba_api.live.nba.endpoints import scoreboard

# Today's Score Board
games = scoreboard.ScoreBoard()

# json
games.get_json()

# dictionary

for games in games.get_dict()["scoreboard"]["games"]:
    if games["gameStatusText"] != "Final":
        print(games["gameId"] + ": Live game")
    else:
        print(games["gameId"] + ": Not live")

temp = "0042200226"
