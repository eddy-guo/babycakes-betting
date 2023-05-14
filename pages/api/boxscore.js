import axios from "axios";

export default async function handler(req, res) {
  const gameIdResponse = await axios.get("http://127.0.0.1:5000/api/livegameid");
  const gameId = gameIdResponse.data;
  const idArray = [];

  for (let i = 0; i < gameId.length; i++) {
    const response = axios.get(
      `https://cdn.nba.com/static/json/liveData/boxscore/boxscore_${gameId[i]}.json`
    );
    idArray.push(response);
  }

  const boxscoreResponses = await Promise.all(idArray);
  const boxscores = boxscoreResponses.map((response) => response.data);

  return res.json(boxscores);
}