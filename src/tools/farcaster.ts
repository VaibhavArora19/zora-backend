import dotenv from "dotenv";
dotenv.config();
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

export const fetchByMention = async (limit: string, query: string) => {
  try {
    // Construct URL with query parameters
    const url = new URL("https://api.neynar.com/v2/farcaster/cast/search");
    url.searchParams.append("q", query);
    url.searchParams.append("limit", limit);

    // Make the API request
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY as string,
      },
    });

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    // Parse and return the JSON response
    return await response.json();
  } catch (error) {
    console.error("Error searching casts:", error);
    throw error;
  }
};

export const postOnFarcaster = async (message: string) => {
  const neynarClient = new NeynarAPIClient({
    apiKey: process.env.API_KEY as string,
  });
  const signerUuid = "80105bb6-6818-4c6d-8752-7a2972131aa1";
  const text = "Hello, World! 🪐";

  neynarClient
    .publishCast({
      signerUuid,
      text,
    })
    .then((response: any) => {
      console.log("cast:", response.cast);
    });
};
