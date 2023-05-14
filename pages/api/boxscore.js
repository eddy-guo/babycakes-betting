import axios from "axios";

export default async function handler(req, res) {
  const gameIdResponse = await axios.get("http://127.0.0.1:5000/api/livegameid");
  var gameId = gameIdResponse.data

  const response = await axios.get(
    `https://cdn.nba.com/static/json/liveData/boxscore/boxscore_${gameId}.json`
  );
  res.status(200).json(response.data);
}
