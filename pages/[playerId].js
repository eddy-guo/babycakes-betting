import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import axios from "axios";

function getAverage(stat_arr) {
  const sum = stat_arr.reduce((x, y) => x + y, 0);
  return (sum / stat_arr.length).toFixed(1);
}

function getWLRatio(wl_arr, char) {
  var counter = 0;
  for (let i = 0; i < wl_arr.length; i++) {
    if (wl_arr[i] == char) {
      counter += 1;
    }
  }
  return counter;
}

export async function getServerSideProps(context) {
  const { playerId } = context.query;
  const response = await axios.get(
    `http://127.0.0.1:5000/api/stats?name=${playerId}&season=2022&season_type=Playoffs`
  );
  const seasonStats = response.data;
  return {
    props: {
      seasonStats,
    },
  };
}

function Home({ seasonStats }) {
  const router = useRouter();
  const { playerId } = router.query;

  const [liveStats, setLiveStats] = useState(null);

  useEffect(() => {
    axios
      .get("/api/boxscore")
      .then((response) => {
        setLiveStats(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);


  if (!seasonStats) {
    return (
      <div>
        <h1>Player does not exist or input is invalid.</h1>
      </div>
    );
  }

  const renderSeasonStats = () => {
    if (!seasonStats) return "Loading... (run stats.py!)";

    if (Object.values(seasonStats) == "Invalid name.") {
      return "Invalid player name (check letter case)."
    }

    const headerLabels = [
      "Game",
      "Date",
      "Points",
      "Rebounds",
      "Assists",
      "Steals",
      "Blocks",
      "Minutes",
      "Win/Loss",
    ];
    const statKeys = [
      "MATCHUP",
      "GAME_DATE",
      "PTS",
      "REB",
      "AST",
      "STL",
      "BLK",
      "MIN",
      "WL",
    ];

    const columnHeaders = headerLabels.map((key, index) => (
      <th key={index}>{key}</th>
    ));

    const gameStats = Object.entries(seasonStats["MATCHUP"]).map(
      (matchup, index) => (
        <tr key={index}>
          {statKeys.map((key) => (
            <td key={key}>{seasonStats[key][index]}</td>
          ))}
        </tr>
      )
    );

    const gameAverages = statKeys
      .slice(2, 8)
      .map((key) => (
        <td key={key}>{getAverage(Object.values(seasonStats[key]))}</td>
      ));

    return (
      <div>
        <table>
          <thead>
            <tr>{columnHeaders}</tr>
          </thead>
          <tbody>
            {gameStats}
            <tr>
              <td>Playoff Average</td>
              <td>n/a</td>
              {gameAverages}
              <td>
                {getWLRatio(Object.values(seasonStats["WL"]), "W")}-
                {getWLRatio(Object.values(seasonStats["WL"]), "L")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderLiveStats = (index) => {
    if (!liveStats) return;

    const player = () => {
      if (!playerId) {
        return null;
      }

      const homePlayer = liveStats[index]["game"]["homeTeam"]["players"].find(
        (player) => player["name"] === playerId
      );
      if (homePlayer) {
        return homePlayer;
      }

      const awayPlayer = liveStats[index]["game"]["awayTeam"]["players"].find(
        (player) => player["name"] === playerId
      );
      if (awayPlayer) {
        return awayPlayer;
      }

      return null;
    };

    const currentPlayer = player();

    if (currentPlayer == null) {
      return "Input invalid or player is not currently playing.";
    }

    return (
      <div>
        <p>Live Game {index + 1}</p>
        <p>Game ID: {liveStats[index]["game"]["gameId"]}</p>
        <p>Game Status: {liveStats[index]["game"]["gameStatusText"]}</p>
        <p>Game Clock: {liveStats[index]["game"]["gameClock"]}</p>
        <p>Points: {currentPlayer["statistics"]["points"]}</p>
        <p>Rebounds: {currentPlayer["statistics"]["reboundsTotal"]}</p>
        <p>Assists: {currentPlayer["statistics"]["assists"]}</p>
        <p>Steals: {currentPlayer["statistics"]["steals"]}</p>
        <p>Blocks: {currentPlayer["statistics"]["blocks"]}</p>
        <p>Minutes: {currentPlayer["statistics"]["minutesCalculated"]}</p>
      </div>
    );
  };

  return (
    <div>
      <h1>Playoff Stats for {playerId}</h1>
      {renderSeasonStats()}
      <h1>Live Game Stats</h1>
      {liveStats &&
        liveStats.map((value, index) => (
          <div key={index}>{renderLiveStats(index)}</div>
        ))}
    </div>
  );
}

export default Home;
