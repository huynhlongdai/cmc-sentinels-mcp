# 🚀 CMC Sentinel-RWA — Institutional Multi-Agent Intelligence & RWA Arbitrage Co-Pilot

> **Built for Build with CMC: API Hackathon 2026** (Track: AI Agents and Automation / RWA)

`CMC Sentinel-RWA` is an institutional-grade, multi-agent AI engine and interactive Web Terminal. It bridges **CoinMarketCap Pro API** real-time market metrics with Model Context Protocol (MCP) and LLMs to solve critical risk and yield problems in crypto and Real World Assets (RWA).

---

## 🌟 Key Features & Triple-Agent Architecture

### 1. 🏛️ **Agent 1: RWA Yield Arbitrage Matrix**
- **Endpoints Used**: `/v1/cryptocurrency/category`, `/v1/real-world-assets/*`
- **Capabilities**: Real-time tracking of tokenized Treasuries and Funds (Ondo USDY, BlackRock BUIDL, STBT, USYC). Calculates Net-APY yield spreads between TradFi RWA yields and DeFi Staking benchmarks (stETH, Aave USDC).

### 2. 🛡️ **Agent 2: DEX Liquidity Depth & Wash-Trading Guard**
- **Endpoints Used**: `/v1/cryptocurrency/quotes/latest`
- **Capabilities**: Computes Volume-to-Market-Cap ratios and alerts AI agents before executing orders into **Liquidity Traps** or overheated wash-trading pairs. Calculates DeFi collateral Health Factors.

### 3. 📊 **Agent 3: Institutional Macro Rebalancer**
- **Endpoints Used**: `/v1/global-metrics/quotes/latest`, `/v1/cryptocurrency/listings/latest`
- **Capabilities**: Dynamically calculates optimal portfolio allocation weights (BTC, ETH, RWA Treasuries, Stables) based on CMC Fear & Greed scores and market dominance trends.

---

## 🖥️ Live Web Dashboard Terminal

Built with React, TypeScript, Vite & Lucide Icons.

- **RWA Live Yield Matrix**: Real-time institutional asset comparison table with APYs & risk ratings.
- **DEX Risk Guard Table**: Color-coded risk levels (LOW, MEDIUM, HIGH) with actionable liquidity warnings.
- **Macro Market Dominance**: Live visual progress bars for BTC.D (58.85%), ETH.D (14.20%), and Altcoin market share.
- **AI Agent Co-Pilot Terminal**: Interactive natural language query interface for LLM interaction.

---

## 🚀 Quick Start

### 1. Backend MCP Server Setup
```bash
git clone https://github.com/longcacrypto/cmc-sentinels-mcp.git
cd cmc-sentinels-mcp
npm install
npm run build
```

### 2. Run Real API Test Verification
```bash
node dist/testApi.js
```

### 3. Launch Web Dashboard Terminal
```bash
cd web-ui
npm install
npm run build
```

---

## 📸 Verified API Execution Evidence

Output log from live CoinMarketCap Pro API call (`src/testApi.ts`):
```text
--- Testing Real CoinMarketCap Pro API Connection ---
BTC Price: $76,533.91
ETH Price: $2,446.30
BTC Dominance: 58.85%
RWA Assets Sample Count: 3

✅ SUCCESS: Real API Call Executed & Verified!
```

---

## 💡 What the API Made Possible & Feedback

- **What it made possible**: CoinMarketCap's Pro API delivered pristine data feed for global metrics, DEX pairs, and structured RWA categories, enabling institutional-level quantitative risk modeling for LLMs.
- **API Feedback**: Having a native single-endpoint query for tokenized yield-spread history would further accelerate AI-driven RWA arbitrage models.

---

## 📜 License
MIT © 2026 Longca Crypto & Agent Army
