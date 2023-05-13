import Head from "next/head";
import styles from "../styles/Home.module.css";
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
        <h1>Jamal Murray Playoff Stats</h1>
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

  const renderLiveStats = () => {
    if (!liveStats) return;

    function findPlayer(name) {
      if (name) {
        for (
          let i = 0;
          i < liveStats["game"]["homeTeam"]["players"].length;
          i++
        ) {
          if (liveStats["game"]["homeTeam"]["players"][i]["name"] == name) {
            return liveStats["game"]["homeTeam"]["players"][i];
          }
        }
        for (
          let i = 0;
          i < liveStats["game"]["awayTeam"]["players"].length;
          i++
        ) {
          if (liveStats["game"]["awayTeam"]["players"][i]["name"] == name) {
            return liveStats["game"]["awayTeam"]["players"][i];
          }
        }
      } else {
        return "Player is null/not in current game.";
      }
    }

    const jamalMurray = findPlayer("Jamal Murray");

    return (
      <div>
        <h1>Jamal Murray Live Game Stats</h1>
        <p>Game ID: {liveStats["game"]["gameId"]}</p>
        <p>Game Status: {liveStats["game"]["gameStatusText"]}</p>
        <p>Game Clock: {liveStats["game"]["gameClock"]}</p>
        <p>Points: {jamalMurray["statistics"]["points"]}</p>
        <p>Rebounds: {jamalMurray["statistics"]["reboundsTotal"]}</p>
        <p>Assists: {jamalMurray["statistics"]["assists"]}</p>
        <p>Steals: {jamalMurray["statistics"]["steals"]}</p>
        <p>Blocks: {jamalMurray["statistics"]["blocks"]}</p>
        <p>Minutes: {jamalMurray["statistics"]["minutesCalculated"]}</p>
      </div>
    );
  };

  return (
    <div>
      {renderSeasonStats()}
      {renderLiveStats()}
    </div>
  );
}
