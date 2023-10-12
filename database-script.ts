import axios from "axios";
import { ILivestreams, ILivestreamsItems } from "./livestreams";

const CHANNEL_IDS = [
  "UC2fVSthyWxWSjsiEAHPzriQ",
  "UCSJ4gkVC6NrvII8umztf0Ow",
  "UCxWNEhY-SNHRvF9Q2LWLK1g",
  "UC7tdoGx0eQfRJm9Qj6GCs0A",
  "UCKdURsjh1xT1vInYBy82n6g",
  "UCz9_4daWw-uWuqeB6_IkhMg",
  "UCOxqgCwgOqC2lMqC5PYz_Dg",
  "UCWzZ5TIGoZ6o-KtbGCyhnhg",
  "UCyD59CI7beJDU493glZpxgA",
  "UCsIg9WMfxjZZvwROleiVsQg",
  "UCJIOFQLGwB3GH9K9waxwynQ",
  "UC9rvsIHgzuiwTQ-yi0Qj2Mw",
  "UC9OIZ77MhlVoi4IxLFXl-nQ",
  "UCkFeoNSqYTa7trn75WM9tsg",
  "UCoQ_Hu6PvpK0jDKrYoSgQrw",
  "UCwVQIkAtyZzQSA-OY1rsGig",
  "UCnV2UaGCuZzepjpQNVGXHAA",
  "UCwkTfp14Sj7o6q9_8ADJpnA",
  "UC1aI76iuDafjZ15hZsQGI-Q",
  "UCncxHd8o_VhhHAJ7QqB5azg",
  "UCPPGd9KtOnMKRoIQOHWAbow",
];

const gistId = "35c088071883c9e93952bd6fbd5ad5ff";
const gistApiUrl = `https://api.github.com/gists/${gistId}`;

const GITHUB_TOKEN = process.env.DATABASE_GIST_PERSONAL_TOKEN;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

async function getYouTubeLiveInfo(channelId: string) {
  try {
    const response = (await axios
      .get(
        `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&part=snippet,id&channelId=${channelId}&maxResults=50&q=live`
      )
      .then((d) => d.data.json())) as ILivestreams;

    return response.items.filter(
      (i) => i.snippet.liveBroadcastContent === "live" && i.id.videoId
    );
  } catch (error) {
    console.error("Erro ao buscar informações das lives do YouTube:", error);
    return [];
  }
}

async function updateGitHubGist(content: string) {
  try {
    const response = await axios.patch(
      gistApiUrl,
      {
        files: {
          "mood-fi_livestream_database.json": {
            content,
          },
        },
      },
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      }
    );

    console.log("Gist atualizado com sucesso:", response.data);
  } catch (error) {
    console.error("Erro ao atualizar o Gist do GitHub:", error);
  }
}

for (const channel of CHANNEL_IDS) {
  getYouTubeLiveInfo(channel).then((liveInfo) => {
    const formattedInfo = JSON.stringify(liveInfo, null, 2);
    updateGitHubGist(formattedInfo);
  });
}
