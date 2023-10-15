import { ILivestreams } from "./livestreams";
import { Octokit } from "octokit";

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

const GIST_ID = "35c088071883c9e93952bd6fbd5ad5ff";
const gistApiUrl = `PATCH /gists/${GIST_ID}`;

const GITHUB_TOKEN = process.env.DATABASE_GIST_PERSONAL_TOKEN;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

async function getYouTubeLiveInfo(channelId: string) {
  try {
    const response = (await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&part=snippet,id&channelId=${channelId}&maxResults=50&q=live`
    ).then((data) => data.json())) as ILivestreams;

    return response.items?.filter(
      (i) => i.snippet.liveBroadcastContent === "live" && i.id.videoId
    );
  } catch (error) {
    console.error(
      "Error during the search for Youtube API live streams:",
      error
    );
    return [];
  }
}

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

async function updateGitHubGist(content: string) {
  try {
    const response = await octokit.request(gistApiUrl, {
      gist_id: GIST_ID,
      files: {
        "mood-fi_livestream_database.json": {
          content: content,
        },
      },
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    console.log("Gist update success:", response.data);
  } catch (error) {
    console.error("Gist update error:", error);
  }
}

const promises = CHANNEL_IDS.map((channelId) => getYouTubeLiveInfo(channelId));

Promise.all(promises).then((results) => {
  updateGitHubGist(JSON.stringify(results.flat(), null, 2));
});
