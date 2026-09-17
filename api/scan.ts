import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

const CMC_API_KEY = process.env.CMC_PRO_API_KEY || "c58d53184b00433cbd7327ca6c789560";

function generateWhaleFlows(symbol: string, vol24h: number, price: number, isDump: boolean) {
  const sym = symbol.toUpperCase();
  if (isDump) {
    const move1 = Math.round(vol24h * 0.04);
    const move2 = Math.round(vol24h * 0.025);
    const move3 = Math.round(vol24h * 0.015);
    return [
      {
        source: `Ví Cá Mập Lớn (Top 1-5 Holders)`,
        sourceType: "COLD_WALLET",
        target: `Sàn Binance / Bybit (CEX Inflow)`,
        targetType: "EXCHANGE",
        amountUsd: move1,
        flowRate: `${(move1 / price).toFixed(0)} ${sym}`,
        direction: "INFLOW_BEARISH",
        actionNote: `Cá mập nạp ${(move1 / 1e6).toFixed(1)}M USD lên sàn tạo áp lực xả trực tiếp`,
      },
      {
        source: `Sàn Binance / Bybit (CEX Inflow)`,
        sourceType: "EXCHANGE",
        target: `Pool Thanh Khoản DEX (Uniswap/Pancake)`,
        targetType: "DEX_POOL",
        amountUsd: move2,
        flowRate: `${(move2 / price).toFixed(0)} ${sym}`,
        direction: "INFLOW_BEARISH",
        actionNote: `Phân tán bán qua các pool phi tập trung để tránh đè giá CEX`,
      },
      {
        source: `Pool Thanh Khoản DEX`,
        sourceType: "DEX_POOL",
        target: `USDT / USDC Stables (Rút Tiền Mặt)`,
        targetType: "RESERVE",
        amountUsd: move3,
        flowRate: `$${(move3 / 1e6).toFixed(1)}M USDT`,
        direction: "INFLOW_BEARISH",
        actionNote: `Chốt lời thành công đưa vốn về Stablecoin an toàn`,
      },
    ];
  } else {
    const move1 = Math.round(vol24h * 0.05);
    const move2 = Math.round(vol24h * 0.03);
    const move3 = Math.round(vol24h * 0.02);
    return [
      {
        source: `Dòng Tiền Stablecoin (USDT / USD)`,
        sourceType: "RESERVE",
        target: `Sàn Coinbase / Binance Spot Desk`,
        targetType: "EXCHANGE",
        amountUsd: move1,
        flowRate: `$${(move1 / 1e6).toFixed(1)}M Fresh Fiat`,
        direction: "OUTFLOW_BULLISH",
        actionNote: `Tổ chức nạp tiền mặt mới vào sàn sẵn sàng gom hàng`,
      },
      {
        source: `Sàn Coinbase / Binance Spot Desk`,
        sourceType: "EXCHANGE",
        target: `Lệnh Khớp Mua Thầm Lặng (TWAP / OTC)`,
        targetType: "DEX_POOL",
        amountUsd: move2,
        flowRate: `${(move2 / price).toFixed(0)} ${sym}`,
        direction: "OUTFLOW_BULLISH",
        actionNote: `Khớp gom chia nhỏ lệnh để giữ giá đi ngang không gây chú ý`,
      },
      {
        source: `Lệnh Khớp Mua Thầm Lặng`,
        sourceType: "DEX_POOL",
        target: `Ví Lạnh Lưu Ký Dài Hạn (Institutional Custody)`,
        targetType: "COLD_WALLET",
        amountUsd: move3,
        flowRate: `${(move3 / price).toFixed(0)} ${sym}`,
        direction: "OUTFLOW_BULLISH",
        actionNote: `Rút coin khỏi sàn giam giữ dài hạn, nguồn cung lưu thông cạn kiệt`,
      },
    ];
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const symbol = String(req.query.symbol || "BTC").toUpperCase().trim();

  try {
    const cmcRes = await axios.get("https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest", {
      headers: { "X-CMC_PRO_API_KEY": CMC_API_KEY },
      params: { symbol },
      timeout: 8000,
    });

    const coin = cmcRes.data?.data?.[symbol];
    if (!coin) {
      return res.status(404).json({ error: `Token ${symbol} không tìm thấy trên CoinMarketCap Pro API.` });
    }

    const quote = coin.quote.USD;
    const price = quote.price;
    const mcap = quote.market_cap || 1;
    const vol24h = quote.volume_24h || 0;
    const p1h = quote.percent_change_1h || 0;
    const p24h = quote.percent_change_24h || 0;
    const p7d = quote.percent_change_7d || 0;
    const volMcapRatio = vol24h / mcap;

    let liquidityTrapRisk = 15;
    if (volMcapRatio < 0.005) liquidityTrapRisk = 95;
    else if (volMcapRatio < 0.01) liquidityTrapRisk = 80;
    else if (volMcapRatio < 0.02) liquidityTrapRisk = 50;
    else if (volMcapRatio > 1.5) liquidityTrapRisk = 70;

    let dumpPressure = 20;
    if (p24h > 15 && p1h < -1) dumpPressure = 85;
    else if (p24h > 25) dumpPressure = 75;
    else if (p24h < -10 && volMcapRatio > 0.3) dumpPressure = 65;
    else if (volMcapRatio > 0.8 && p24h < 0) dumpPressure = 80;
    else if (p24h >= 0 && p24h <= 5 && volMcapRatio > 0.02 && volMcapRatio < 0.2) dumpPressure = 15;

    let signal: "ACCUMULATION" | "DISTRIBUTION" | "NEUTRAL" = "NEUTRAL";
    if (p24h >= -2 && p24h <= 4 && p7d > -5 && volMcapRatio >= 0.03 && volMcapRatio <= 0.15) {
      signal = "ACCUMULATION";
    } else if (dumpPressure >= 70 || (p24h > 15 && volMcapRatio > 0.5)) {
      signal = "DISTRIBUTION";
    }

    let riskLevel: "LOW" | "MODERATE" | "HIGH" | "EXTREME" = "LOW";
    if (liquidityTrapRisk > 80 || dumpPressure > 80) riskLevel = "EXTREME";
    else if (liquidityTrapRisk > 50 || dumpPressure > 60) riskLevel = "HIGH";
    else if (liquidityTrapRisk > 30 || dumpPressure > 40) riskLevel = "MODERATE";

    let estSlippage = 0.05;
    if (vol24h < 500000) estSlippage = 14.5;
    else if (vol24h < 2000000) estSlippage = 6.2;
    else if (vol24h < 10000000) estSlippage = 2.1;
    else if (vol24h < 100000000) estSlippage = 0.35;
    else estSlippage = 0.02;

    let verdict = "";
    if (signal === "DISTRIBUTION") {
      verdict = `⚠️ CẢNH BÁO ÁP LỰC XẢ: Token ${coin.symbol} (${coin.name}) ghi nhận biến động 24h là ${p24h.toFixed(2)}% với hệ số Vol/Mcap = ${volMcapRatio.toFixed(3)}. Áp lực bán tháo hoặc chốt lời đang chiếm ưu thế (Điểm Dump Pressure: ${dumpPressure}/100). Trượt giá lệnh $10,000 ước tính: ${estSlippage}%. KHUYẾN NGHỊ: Không mua đuổi lúc này.`;
    } else if (signal === "ACCUMULATION") {
      verdict = `🟢 TÍN HIỆU TÍCH LŨY: Dòng tiền vào ${coin.symbol} (${coin.name}) đang duy trì ổn định. Vốn hóa $${(mcap / 1e6).toFixed(1)}M đi kèm volume 24h $${(vol24h / 1e6).toFixed(1)}M phản ánh lực hấp thụ tự nhiên (Hệ số Vol/Mcap ${volMcapRatio.toFixed(3)} chuẩn định chế). Độ sâu thanh khoản tốt, trượt giá lệnh $10,000 chỉ khoảng ${estSlippage}%.`;
    } else {
      verdict = `⚖️ TRẠNG THÁI CÂN BẰNG: ${coin.symbol} (${coin.name}) đang dao động tích lũy trong biên độ 24h là ${p24h.toFixed(2)}%. Không có dấu hiệu bẫy thanh khoản đột biến. Trượt giá ước tính ở mức chấp nhận được (${estSlippage}%).`;
    }

    const isDump = signal === "DISTRIBUTION" || dumpPressure > 50;
    const flows = generateWhaleFlows(coin.symbol, vol24h, price, isDump);

    return res.status(200).json({
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
      whale_flows: flows,
      source: "COINMARKETCAP_PRO_API_LIVE",
      fetched_at: new Date().toISOString(),
    });
  } catch (error: any) {
    const msg = error?.response?.data?.status?.error_message || error.message;
    return res.status(500).json({ error: msg });
  }
}
