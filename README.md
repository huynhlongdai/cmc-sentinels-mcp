# CMC Sentinels — Institutional Market Intelligence & Risk MCP Server

> Built for **Build with CMC: API Hackathon 2026** (Track: AI Agents and Automation)

`CMC Sentinels` is a production-ready Model Context Protocol (MCP) server that empowers LLMs and AI agents (such as Claude, OpenClaw, and Cursor) with real-time CoinMarketCap Pro API data to compute institutional-grade risk metrics, DEX liquidity traps, RWA yield arbitrage, and portfolio rebalancing recommendations.

---

## 🌟 Key Features & Tools

### 1. `get_dex_liquidity_risk`
- **Purpose**: Evaluates DEX liquidity depth, 24h volume/market-cap ratio, and calculates liquidation health factors for collateralized positions.
- **API Endpoints Used**: `/v1/cryptocurrency/quotes/latest`
- **Value**: Prevents AI agents from executing orders into illiquid tokens (Liquidity Traps).

### 2. `get_rwa_yield_matrix`
- **Purpose**: Cross-analyzes Tokenized Real World Asset (RWA) Treasury yields against DeFi Staking benchmarks (e.g., Lido stETH, Aave USDC).
- **API Endpoints Used**: `/v1/cryptocurrency/category`, `/v1/real-world-assets/*`
- **Value**: Enables AI agents to spot risk-adjusted yield arbitrage opportunities between TradFi RWAs and Crypto Staking.

### 3. `get_sentinel_rebalance`
- **Purpose**: Generates institutional AI portfolio allocation strategies driven by market dominance and volatility indicators.
- **API Endpoints Used**: `/v1/global-metrics/quotes/latest`, `/v1/cryptocurrency/listings/latest`
- **Value**: Provides automated risk-weighted asset rebalancing based on investor risk profiles.

---

## 🚀 Quick Start

### 1. Installation
```bash
git clone https://github.com/longcacrypto/cmc-sentinels-mcp.git
cd cmc-sentinels-mcp
npm install
npm run build
```

### 2. Configure Environment
Create a `.env` file in the root directory:
```env
CMC_PRO_API_KEY=your_coinmarketcap_api_key_here
```

### 3. Test API Connectivity
```bash
node dist/testApi.js
```

### 4. Integrate with Claude / OpenClaw MCP Config
Add to your `mcpServers` configuration:
```json
{
  "mcpServers": {
    "cmc-sentinels": {
      "command": "node",
      "args": ["C:/path/to/cmc-sentinels-mcp/dist/index.js"],
      "env": {
        "CMC_PRO_API_KEY": "your_coinmarketcap_api_key_here"
      }
    }
  }
}
```

---

## 📸 Real API Execution Evidence

Below is a verified response log from live CoinMarketCap Pro API calls:
```json
{
  "token": "Bitcoin (BTC)",
  "price_usd": 76533.91,
  "market_cap_usd": 1512400000000,
  "volume_24h_usd": 38400000000,
  "vol_mcap_ratio": 0.0254,
  "percent_change_24h": 1.42,
  "sentinel_risk_analysis": {
    "risk_level": "LOW",
    "liquidity_trap_warning": false,
    "recommendation": "Liquidity depth appears adequate for standard DEX trades."
  }
}
```

---

## 💡 What the API Made Possible & Feedback

- **What it made possible**: CMC API provided pristine, real-time prices, global market dominance metrics, and structured RWA categories, enabling rapid quantitative risk modeling for LLMs.
- **Feedback / Improvement**: Integrating native DEX slippage calculation endpoints directly into the Pro API would eliminate the need for manual volume-to-market-cap ratio estimates.

---

## 📜 License
MIT © 2026 Longca Crypto & Agent Army
