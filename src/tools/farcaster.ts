import dotenv from "dotenv";
dotenv.config();
import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import { FARCASTER_URL } from "../constants";

export const fetchByMention = async (limit: string, query: string) => {
  try {
    // Construct URL with query parameters
    const url = new URL(`${FARCASTER_URL}/cast/search`);
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
  const signerUuid = "27a08f94-a6a1-4180-8830-1635db9361df";

  const data = await neynarClient.publishCast({
    signerUuid,
    text: message,
  });

  return data;
};

export const sendNotification = async (fids: string[],title: string, body: string, target_url: string) => {
  try {

    const response = await fetch(`${FARCASTER_URL}/frame/notifications`, {
      method: "POST",
      headers: {
        "x-api-key": process.env.API_KEY as string,
      },
      body: JSON.stringify({
        target_fids: fids,
        notification: {
          title,
          body,
          target_url,
        }
      })
    });
    
    const data = await response.json();

    console.log("Notification response:", data);
    if (!response.ok) {
      throw new Error(`Error sending notification: ${data.error}`);
    }
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
}