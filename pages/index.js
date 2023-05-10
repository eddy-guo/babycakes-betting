import Head from "next/head";
import styles from "../styles/Home.module.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

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

export default function Home() {
  const [seasonStats, setSeasonStats] = useState(null);
  const [liveStats, setLiveStats] = useState(null);

  useEffect(() => {
    axios.all([
      axios.get('/api/stats?name=Jamal%20Murray&season=2022&season_type=Playoffs'),
      axios.get('/api/boxscore')
    ]).then(axios.spread((statsResponse, boxscoreResponse) => {
      setSeasonStats(statsResponse.data);
      setLiveStats(boxscoreResponse.data);
    })).catch((error) => {
      console.error(error);
    });
  }, []);

  const renderGameStats = () => {
    if (!seasonStats) return "Loading...";

    const headerLabels = ["Game", "Date", "Points", "Rebounds", "Assists", "Steals", "Blocks", "Minutes", "Win/Loss"];
    const statKeys = ["MATCHUP", "GAME_DATE", "PTS", "REB", "AST", "STL", "BLK", "MIN", "WL"];
    
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

    const gameAverages = statKeys.slice(2, 8).map((key) => (
      <td key={key}>{getAverage(Object.values(seasonStats[key]))}</td>
    ));

    return (
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
            <td>{getWLRatio(Object.values(seasonStats["WL"]), "W")}-{getWLRatio(Object.values(seasonStats["WL"]), "L")}</td>
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
