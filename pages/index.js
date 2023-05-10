import Head from 'next/head';
import styles from '../styles/Home.module.css';
import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Home() {
  const [liveStats, setLiveStats] = useState(null);
  const [seasonStats, setSeasonStats] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/live-game?id=203999&date=05/07/2023")
      .then(response => {
        setLiveStats(response.data);
      })
      .catch(error => {
        console.error(error);
      });
    axios.get("/api/stats?name=Jamal%20Murray&season=2022&season_type=Playoffs")
      .then(response => {
        setSeasonStats(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h1>Game Stats</h1>
      {liveStats && (
        <pre>{JSON.stringify(liveStats, null, 2)}</pre>
      )}
      <h1>Career Stats</h1>
      {seasonStats && (
        <pre>{JSON.stringify(seasonStats, null, 2)}</pre>
      )}
    </div>
    
  );
}