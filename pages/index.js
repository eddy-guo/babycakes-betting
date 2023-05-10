import Head from "next/head";
import styles from "../styles/Home.module.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [seasonStats, setSeasonStats] = useState(null);

  useEffect(() => {
    axios
      .get("/api/stats?name=Jamal%20Murray&season=2022&season_type=Playoffs")
      .then((response) => {
        setSeasonStats(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const renderGameStats = () => {
    if (!seasonStats) return null;
    const matchup = Object.values(seasonStats["MATCHUP"]);
    const date = Object.values(seasonStats["GAME_DATE"]);
    const murrayMinutes = Object.values(seasonStats["MIN"]);
    const murrayPoints = Object.values(seasonStats["PTS"]);
    const murrayRebounds = Object.values(seasonStats["REB"]);
    const murrayAssists = Object.values(seasonStats["AST"]);
    const murraySteals = Object.values(seasonStats["STL"]);
    const murrayBlocks = Object.values(seasonStats["BLK"]);
    const win_loss = Object.values(seasonStats["WL"]);

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
      <table>
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
        <tbody>{gameStats}</tbody>
      </table>
    );
  };

  return (
    <div>
      <h1>Playoff Stats: Jamal Murray</h1>
      {renderGameStats()}
    </div>
  );
}
