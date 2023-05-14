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

export default function Home() {
  const [seasonStats, setSeasonStats] = useState(null);
  const [liveStats, setLiveStats] = useState(null);

  useEffect(() => {
    axios
      .get("/api/stats?name=Jamal%20Murray&season=2022&season_type=Playoffs")
      .then((response) => {
        setSeasonStats(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    axios
      .get("/api/boxscore")
      .then((response) => {
        setLiveStats(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const renderSeasonStats = () => {
    if (!seasonStats) return "Loading... (run stats.py!)";

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

    const gameStats = statKeys.map((matchup, index) => (
      <tr key={index}>
        {statKeys.map((key) => (
          <td key={key}>{seasonStats[key][index]}</td>
        ))}
      </tr>
    ));

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

    function findPlayer(name) {
      if (name) {
        for (
          let i = 0;
          i < liveStats[index]["game"]["homeTeam"]["players"].length;
          i++
        ) {
          if (
            liveStats[index]["game"]["homeTeam"]["players"][i]["name"] == name
          ) {
            return liveStats[index]["game"]["homeTeam"]["players"][i];
          }
        }
        for (
          let i = 0;
          i < liveStats[index]["game"]["awayTeam"]["players"].length;
          i++
        ) {
          if (
            liveStats[index]["game"]["awayTeam"]["players"][i]["name"] == name
          ) {
            return liveStats[index]["game"]["awayTeam"]["players"][i];
          }
        }
      } else {
        return "Invalid input.";
      }
    }

    if (findPlayer("Jamal Murray") == null) {
      return "Player is not currently playing.";
    }

    const player = findPlayer("Jamal Murray");

    return (
      <div>
        <p>Live Game {index + 1}</p>
        <p>Game ID: {liveStats[index]["game"]["gameId"]}</p>
        <p>Game Status: {liveStats[index]["game"]["gameStatusText"]}</p>
        <p>Game Clock: {liveStats[index]["game"]["gameClock"]}</p>
        <p>Points: {player["statistics"]["points"]}</p>
        <p>Rebounds: {player["statistics"]["reboundsTotal"]}</p>
        <p>Assists: {player["statistics"]["assists"]}</p>
        <p>Steals: {player["statistics"]["steals"]}</p>
        <p>Blocks: {player["statistics"]["blocks"]}</p>
        <p>Minutes: {player["statistics"]["minutesCalculated"]}</p>
      </div>
    );
  };

  return (
    <div>
      <h1>Jamal Murray Playoff Stats</h1>
      {renderSeasonStats()}
      <h1>Jamal Murray Live Game Stats</h1>
      {liveStats && liveStats.map((value, index) => renderLiveStats(index))}
    </div>
  );
}
