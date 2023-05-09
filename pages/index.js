import Head from 'next/head';
import styles from '../styles/Home.module.css';
import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Home() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/game-stats?id=203999&date=05/07/2023")
      .then(response => {
        setStats(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h1>Game Stats</h1>
      {stats && (
        <pre>{JSON.stringify(stats, null, 2)}</pre>
      )}
    </div>
  );
}