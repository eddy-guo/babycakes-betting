import axios from "axios";

export default async function handler(req, res) {
  const response = await axios.get(
    "https://cdn.nba.com/static/json/liveData/boxscore/boxscore_0042200226.json"
  );
  res.status(200).json(response.data);
}
