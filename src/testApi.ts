import { CMCClient } from "./cmcClient.js";

const apiKey = "c58d53184b00433cbd7327ca6c789560";
const client = new CMCClient(apiKey);

async function runTest() {
  console.log("--- Testing Real CoinMarketCap Pro API Connection ---");
  try {
    const quotes = await client.getLatestQuotes(["BTC", "ETH"]);
    console.log("BTC Price: $" + quotes["BTC"].quote.USD.price.toFixed(2));
    console.log("ETH Price: $" + quotes["ETH"].quote.USD.price.toFixed(2));

    const metrics = await client.getGlobalMetrics();
    console.log("BTC Dominance: " + metrics.btc_dominance.toFixed(2) + "%");

    const rwa = await client.getRWAAssets();
    console.log("RWA Assets Sample Count: " + rwa.length);
    console.log("\n✅ SUCCESS: Real API Call Executed & Verified!");
  } catch (err: any) {
    console.error("Test Failed:", err.message);
  }
}

runTest();
