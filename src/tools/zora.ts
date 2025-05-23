import { getCoin } from "@zoralabs/coins-sdk";
import { base } from "viem/chains";

export async function fetchSingleCoin(address: string) {
  const response = await getCoin({
    address,
    chain: base.id, // Optional: Base chain set by default
  });

  const coin = response.data?.zora20Token;

  if (coin) {
    console.log("Coin Details:");
    console.log("- Name:", coin.name);
    console.log("- Symbol:", coin.symbol);
    console.log("- Description:", coin.description);
    console.log("- Total Supply:", coin.totalSupply);
    console.log("- Market Cap:", coin.marketCap);
    console.log("- 24h Volume:", coin.volume24h);
    console.log("- Creator:", coin.creatorAddress);
    console.log("- Created At:", coin.createdAt);
    console.log("- Unique Holders:", coin.uniqueHolders);

    // Access media if available
    if (coin.mediaContent?.previewImage) {
      console.log("- Preview Image:", coin.mediaContent.previewImage);
    }
  }

  return coin;
}
