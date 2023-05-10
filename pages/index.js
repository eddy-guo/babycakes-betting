import Head from "next/head";
import styles from "../styles/Home.module.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

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

  const renderGameStats = () => {
    if (!seasonStats) return null;
    const matchup = Object.values(seasonStats["MATCHUP"]);
    const date = Object.values(seasonStats["GAME_DATE"]);
    const murrayPoints = Object.values(seasonStats["PTS"]);
    const murrayRebounds = Object.values(seasonStats["REB"]);
    const murrayAssists = Object.values(seasonStats["AST"]);
    const murraySteals = Object.values(seasonStats["STL"]);
    const murrayBlocks = Object.values(seasonStats["BLK"]);
    const murrayMinutes = Object.values(seasonStats["MIN"]);
    const win_loss = Object.values(seasonStats["WL"]);

    function getAverage(stat_arr) {
      const sum = stat_arr.reduce((x, y) => x + y, 0);
      return sum / stat_arr.length;
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

    const gameStats = matchup.map((matchup, index) => (
      <tr key={index}>
        <td>{matchup}</td>
        <td>{date[index]}</td>
        <td>{murrayPoints[index]}</td>
        <td>{murrayRebounds[index]}</td>
        <td>{murrayAssists[index]}</td>
        <td>{murraySteals[index]}</td>
        <td>{murrayBlocks[index]}</td>
        <td>{murrayMinutes[index]}</td>
        <td>{win_loss[index]}</td>
      </tr>
    ));

    return (
      <table id="game_stats">
        <thead>
          <tr>
            <th>Game</th>
            <th>Date</th>
            <th>Points</th>
            <th>Rebounds</th>
            <th>Assists</th>
            <th>Steals</th>
            <th>Blocks</th>
            <th>Minutes</th>
            <th>Win/Loss</th>
          </tr>
        </thead>
        <tbody>
          {gameStats}
          <tr>
            <td>Playoff Average</td>
            <td>n/a</td>
            <td>{getAverage(murrayPoints)}</td>
            <td>{getAverage(murrayRebounds)}</td>
            <td>{getAverage(murrayAssists)}</td>
            <td>{getAverage(murraySteals)}</td>
            <td>{getAverage(murrayBlocks)}</td>
            <td>{getAverage(murrayMinutes)}</td>
            <td>{getWLRatio(win_loss, "W")}-{getWLRatio(win_loss, "L")}</td>
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <h1>Playoff Stats: Jamal Murray</h1>
      {renderGameStats()}
      <pre>{JSON.stringify(liveStats, null, 2)}</pre>
    </div>
  );
}
