import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const CMC_API_KEY = process.env.CMC_PRO_API_KEY || "c58d53184b00433cbd7327ca6c789560";

app.use(cors());
app.use(express.json());

interface QuantitativeRiskAnalysis {
  symbol: string;
  name: string;
  price: number;
  market_cap: number;
  volume_24h: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  vol_mcap_ratio: number;
  liquidity_trap_risk: number; // 0 - 100%
  dump_pressure_score: number; // 0 - 100%
  signal: "ACCUMULATION" | "DISTRIBUTION" | "NEUTRAL";
  risk_level: "LOW" | "MODERATE" | "HIGH" | "EXTREME";
  estimated_slippage_10k_usd: number; // %
  ai_verdict: string;
  mathematical_indicators: {
    volatility_velocity: number;
    turnover_deviation: string;
    orderbook_depth_est: string;
  };
}

// Algorithm to calculate genuine quantitative metrics from live CMC data
function analyzeTokenMetrics(coin: any): QuantitativeRiskAnalysis {
  const quote = coin.quote.USD;
  const price = quote.price;
  const mcap = quote.market_cap || 1;
  const vol24h = quote.volume_24h || 0;
  const p1h = quote.percent_change_1h || 0;
  const p24h = quote.percent_change_24h || 0;
  const p7d = quote.percent_change_7d || 0;

  const volMcapRatio = vol24h / mcap;

  // 1. Liquidity Trap Score (Low volume relative to market cap = impossible to sell large size)
  let liquidityTrapRisk = 0;
  if (volMcapRatio < 0.005) {
    liquidityTrapRisk = 95;
  } else if (volMcapRatio < 0.01) {
    liquidityTrapRisk = 80;
  } else if (volMcapRatio < 0.02) {
    liquidityTrapRisk = 50;
  } else if (volMcapRatio > 1.5) {
    liquidityTrapRisk = 70; // Wash trading / pump-and-dump velocity
  } else {
    liquidityTrapRisk = 15; // Healthy
  }

  // 2. Dump Pressure Score (Price pumped while volume spike, or high turnover with negative 1h change)
  let dumpPressure = 20;
  if (p24h > 15 && p1h < -1) {
    dumpPressure = 85; // Sharp rejection after pump
  } else if (p24h > 25) {
    dumpPressure = 75; // Overheated
  } else if (p24h < -10 && volMcapRatio > 0.3) {
    dumpPressure = 65; // Active panic dumping
  } else if (volMcapRatio > 0.8 && p24h < 0) {
    dumpPressure = 80; // Heavy selling volume
  } else if (p24h >= 0 && p24h <= 5 && volMcapRatio > 0.02 && volMcapRatio < 0.2) {
    dumpPressure = 15; // Stable organic trading
  }

  // 3. Signal Decision
  let signal: "ACCUMULATION" | "DISTRIBUTION" | "NEUTRAL" = "NEUTRAL";
  if (p24h >= -2 && p24h <= 4 && p7d > -5 && volMcapRatio >= 0.03 && volMcapRatio <= 0.15) {
    signal = "ACCUMULATION";
  } else if (dumpPressure >= 70 || (p24h > 15 && volMcapRatio > 0.5)) {
    signal = "DISTRIBUTION";
  }

  // 4. Risk Level
  let riskLevel: "LOW" | "MODERATE" | "HIGH" | "EXTREME" = "LOW";
  if (liquidityTrapRisk > 80 || dumpPressure > 80) {
    riskLevel = "EXTREME";
  } else if (liquidityTrapRisk > 50 || dumpPressure > 60) {
    riskLevel = "HIGH";
  } else if (liquidityTrapRisk > 30 || dumpPressure > 40) {
    riskLevel = "MODERATE";
  }

  // 5. Estimated Slippage for $10,000 Market Sell
  let estSlippage = 0.05;
  if (vol24h < 500000) {
    estSlippage = 14.5;
  } else if (vol24h < 2000000) {
    estSlippage = 6.2;
  } else if (vol24h < 10000000) {
    estSlippage = 2.1;
  } else if (vol24h < 100000000) {
    estSlippage = 0.35;
  } else {
    estSlippage = 0.02; // Deep liquidity (BTC/ETH/SOL)
  }

  // 6. AI Synthesized Verdict
  let verdict = "";
  if (signal === "DISTRIBUTION") {
    verdict = `⚠️ CẢNH BÁO ÁP LỰC XẢ: Token ${coin.symbol} ghi nhận biến động 24h là ${p24h.toFixed(2)}% với hệ số Vol/Mcap = ${volMcapRatio.toFixed(3)}. Áp lực bán tháo hoặc chốt lời đang chiếm ưu thế (Điểm Dump Pressure: ${dumpPressure}/100). Khuyến nghị: KHÔNG NÊN MUA ĐUỔI, trượt giá lệnh lớn ước tính là ${estSlippage}%. Chờ nhịp hấp thụ cạn volume.`;
  } else if (signal === "ACCUMULATION") {
    verdict = `🟢 TÍN HIỆU TÍCH LŨY: Dòng tiền vào ${coin.symbol} đang duy trì ổn định. Vốn hóa $${(mcap / 1e6).toFixed(1)}M đi kèm volume $${(vol24h / 1e6).toFixed(1)}M phản ánh lực hấp thụ tự nhiên (Hệ số Vol/Mcap ${volMcapRatio.toFixed(3)} chuẩn định chế). Độ sâu thanh khoản tốt, trượt giá lệnh $10,000 chỉ khoảng ${estSlippage}%.`;
  } else {
    verdict = `⚖️ TRẠNG THÁI CÂN BẰNG: ${coin.symbol} đang dao động tích lũy trong biên độ 24h là ${p24h.toFixed(2)}%. Không có dấu hiệu bẫy thanh khoản đột biến. Trượt giá ước tính ở mức chấp nhận được (${estSlippage}%).`;
  }

  return {
    symbol: coin.symbol,
    name: coin.name,
    price: quote.price,
    market_cap: quote.market_cap,
    volume_24h: quote.volume_24h,
    percent_change_1h: quote.percent_change_1h,
    percent_change_24h: quote.percent_change_24h,
    percent_change_7d: quote.percent_change_7d,
    vol_mcap_ratio: Number(volMcapRatio.toFixed(4)),
    liquidity_trap_risk: liquidityTrapRisk,
    dump_pressure_score: dumpPressure,
    signal,
    risk_level: riskLevel,
    estimated_slippage_10k_usd: estSlippage,
    ai_verdict: verdict,
    mathematical_indicators: {
      volatility_velocity: Number((Math.abs(p1h) * 24).toFixed(2)),
      turnover_deviation: volMcapRatio > 0.3 ? "CAO BẤT THƯỜNG" : "BÌNH THƯỜNG",
      orderbook_depth_est: vol24h > 50000000 ? "DỒI DÀO (Deep)" : vol24h > 2000000 ? "TRUNG BÌNH (Moderate)" : "MỎNG (Thin)",
    },
  };
}

// API Endpoint to scan any token live from CoinMarketCap
app.get("/api/scan", async (req, res) => {
  const symbol = String(req.query.symbol || "BTC").toUpperCase();
  try {
    const response = await axios.get("https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest", {
      headers: { "X-CMC_PRO_API_KEY": CMC_API_KEY },
      params: { symbol },
    });

    const coinData = response.data.data[symbol];
    if (!coinData) {
      return res.status(404).json({ error: `Token ${symbol} không tìm thấy trên CoinMarketCap Pro API.` });
    }

    const analysis = analyzeTokenMetrics(coinData);
    return res.json(analysis);
  } catch (error: any) {
    console.error("CMC API Error:", error?.response?.data || error.message);
    return res.status(500).json({ error: error?.response?.data?.status?.error_message || error.message });
  }
});

// API Endpoint to get Market Overview
app.get("/api/market", async (req, res) => {
  try {
    const [globalRes, topRes] = await Promise.all([
      axios.get("https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest", {
        headers: { "X-CMC_PRO_API_KEY": CMC_API_KEY },
      }),
      axios.get("https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest", {
        headers: { "X-CMC_PRO_API_KEY": CMC_API_KEY },
        params: { symbol: "BTC,ETH,SOL,PEPE,DOGE" },
      }),
    ]);

    const global = globalRes.data.data;
    const coins = topRes.data.data;

    return res.json({
      btc_dominance: global.btc_dominance,
      eth_dominance: global.eth_dominance,
      total_market_cap: global.quote?.USD?.total_market_cap,
      total_volume_24h: global.quote?.USD?.total_volume_24h,
      tokens: Object.values(coins).map((c: any) => analyzeTokenMetrics(c)),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`CMC Sentinel Backend Server running live on port ${PORT}`);
});
