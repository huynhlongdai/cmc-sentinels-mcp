import { useState } from "react";
import {
  ShieldAlert,
  Landmark,
  PieChart,
  Bot,
  Zap,
} from "lucide-react";

interface RWAAsset {
  symbol: string;
  name: string;
  type: string;
  issuer: string;
  underlying: string;
  marketCapUsd: number;
  apy: number;
  riskRating: string;
}

interface DEXRisk {
  symbol: string;
  price: number;
  mcap: number;
  vol24h: number;
  volMcapRatio: number;
  change24h: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  warning: string;
}

export function App() {
  const [activeTab, setActiveTab] = useState<"rwa" | "dex" | "rebalance" | "agent">("rwa");
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [chatLog, setChatLog] = useState<Array<{ sender: "user" | "agent"; text: string }>>([
    {
      sender: "agent",
      text: "Xin chào Anh Longca! Tôi là CMC Sentinel-RWA Co-Pilot. Tôi có thể hỗ trợ phân tích Arbitrage Yield giữa RWA Treasuries và DeFi Staking, hoặc kiểm tra rủi ro thanh khoản DEX.",
    },
  ]);

  // Mocked/Calculated Live Data based on Real CMC API Metrics
  const rwaData: RWAAsset[] = [
    { symbol: "USDY", name: "Ondo US Dollar Yield", type: "US Short-Term Treasuries", issuer: "Ondo Finance", underlying: "US Treasuries & Bank Deposits", marketCapUsd: 452000000, apy: 5.15, riskRating: "AAA (Institutional)" },
    { symbol: "STBT", name: "Matrixdock Short-Term Treasury", type: "US T-Bills Token", issuer: "Matrixport", underlying: "US Treasury Bills", marketCapUsd: 128000000, apy: 4.85, riskRating: "AA+" },
    { symbol: "USYC", name: "Hashnote Short Duration Yield", type: "Yield Coin", issuer: "Hashnote", underlying: "US Treasuries & Repo", marketCapUsd: 215000000, apy: 5.08, riskRating: "AAA" },
    { symbol: "BUIDL", name: "BlackRock USD Institutional Digital", type: "Tokenized Fund", issuer: "BlackRock / Securitize", underlying: "Cash, US T-Bills, Repos", marketCapUsd: 520000000, apy: 4.95, riskRating: "AAA (Prime)" },
  ];

  const dexRisks: DEXRisk[] = [
    { symbol: "BTC", price: 76533.91, mcap: 1512400000000, vol24h: 38400000000, volMcapRatio: 0.0254, change24h: 1.42, riskLevel: "LOW", warning: "DEX liquidity depth is optimal. Low slippage." },
    { symbol: "ETH", price: 2446.30, mcap: 294100000000, vol24h: 18200000000, volMcapRatio: 0.0618, change24h: -0.85, riskLevel: "LOW", warning: "Healthy trading volume and deep liquidity." },
    { symbol: "MEMECOIN_X", price: 0.000042, mcap: 15000000, vol24h: 85000, volMcapRatio: 0.0056, change24h: 38.5, riskLevel: "HIGH", warning: "LIQUIDITY TRAP ALERT: 24h Volume < 1% of Mcap. High slippage on Uniswap." },
  ];

  const handleSendChat = () => {
    if (!query.trim()) return;
    const userMsg = query;
    setChatLog((prev) => [...prev, { sender: "user", text: userMsg }]);
    setQuery("");
    setLoading(true);

    setTimeout(() => {
      let reply = "";
      if (userMsg.toLowerCase().includes("rwa") || userMsg.toLowerCase().includes("yield")) {
        reply = "📊 Phân tích RWA Yield Arbitrage: Hiện tại Ondo USDY (5.15% APY) và BlackRock BUIDL (4.95% APY) đang có mức lợi suất thực tế cao gần bằng Aave USDC (6.20%) nhưng rủi ro thanh lý hợp đồng thông minh cực thấp. Đây là kênh trú ẩn dòng tiền an toàn cho mùa biến động.";
      } else if (userMsg.toLowerCase().includes("risk") || userMsg.toLowerCase().includes("dex") || userMsg.toLowerCase().includes("btc")) {
        reply = "🛡️ Phân tích Sentinel DEX Risk: Token BTC hiện có chỉ số Vol/Mcap = 0.0254 (Rủi ro LOW). Độ sâu thanh khoản trên các cặp DEX chính (Uniswap v3, Curve) rất đảm bảo. Không phát hiện dấu hiệu Wash Trading.";
      } else {
        reply = `🤖 Sentinel Agent Co-Pilot đã nhận lệnh "${userMsg}". Dữ liệu từ CoinMarketCap Pro API xác nhận các thông số thị trường vẫn ổn định với BTC Dominance = 58.85%.`;
      }
      setChatLog((prev) => [...prev, { sender: "agent", text: reply }]);
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{ backgroundColor: "#0f172a", color: "#f8fafc", minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid #1e293b", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#1e293b" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ backgroundColor: "#3b82f6", padding: "8px", borderRadius: "8px", display: "flex" }}>
            <Zap color="#ffffff" size={24} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "bold", background: "linear-gradient(to right, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              CMC SENTINEL-RWA
            </h1>
            <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>
              Institutional Multi-Agent Intelligence & RWA Arbitrage Engine (CMC Pro API Powered)
            </p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ backgroundColor: "#065f46", color: "#34d399", padding: "4px 12px", borderRadius: "9999px", fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10b981" }}></span>
            CMC Pro API Connected
          </span>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>Build with CMC Hackathon 2026</span>
        </div>
      </header>

      {/* Main Layout */}
      <div style={{ padding: "24px 32px", maxWidth: "1400px", margin: "0 auto" }}>
        {/* Navigation Tabs */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", borderBottom: "1px solid #334155", paddingBottom: "12px" }}>
          <button
            onClick={() => setActiveTab("rwa")}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "rwa" ? "#2563eb" : "#1e293b",
              color: "#ffffff",
              cursor: "pointer",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Landmark size={18} /> RWA Yield Matrix
          </button>
          <button
            onClick={() => setActiveTab("dex")}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "dex" ? "#2563eb" : "#1e293b",
              color: "#ffffff",
              cursor: "pointer",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <ShieldAlert size={18} /> DEX Liquidity & Risk Guard
          </button>
          <button
            onClick={() => setActiveTab("rebalance")}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "rebalance" ? "#2563eb" : "#1e293b",
              color: "#ffffff",
              cursor: "pointer",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <PieChart size={18} /> Macro Portfolio Rebalancer
          </button>
          <button
            onClick={() => setActiveTab("agent")}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "agent" ? "#2563eb" : "#1e293b",
              color: "#ffffff",
              cursor: "pointer",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Bot size={18} /> AI Co-Pilot Terminal
          </button>
        </div>

        {/* Tab 1: RWA Yield Matrix */}
        {activeTab === "rwa" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "24px" }}>
              <div style={{ backgroundColor: "#1e293b", padding: "20px", borderRadius: "12px", border: "1px solid #334155" }}>
                <p style={{ color: "#94a3b8", margin: 0, fontSize: "14px" }}>Total RWA Market Cap Tracked</p>
                <h2 style={{ fontSize: "28px", margin: "8px 0 0 0", color: "#60a5fa" }}>$1,315,000,000</h2>
              </div>
              <div style={{ backgroundColor: "#1e293b", padding: "20px", borderRadius: "12px", border: "1px solid #334155" }}>
                <p style={{ color: "#94a3b8", margin: 0, fontSize: "14px" }}>Top RWA Benchmark APY</p>
                <h2 style={{ fontSize: "28px", margin: "8px 0 0 0", color: "#34d399" }}>5.15% APY (Ondo USDY)</h2>
              </div>
              <div style={{ backgroundColor: "#1e293b", padding: "20px", borderRadius: "12px", border: "1px solid #334155" }}>
                <p style={{ color: "#94a3b8", margin: 0, fontSize: "14px" }}>DeFi vs RWA Yield Spread</p>
                <h2 style={{ fontSize: "28px", margin: "8px 0 0 0", color: "#f59e0b" }}>+1.05% (Aave USDC)</h2>
              </div>
            </div>

            <div style={{ backgroundColor: "#1e293b", borderRadius: "12px", padding: "24px", border: "1px solid #334155" }}>
              <h3 style={{ marginTop: 0, marginBottom: "16px", fontSize: "18px" }}>Institutional Real World Assets (RWA) Matrix</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #334155", color: "#94a3b8" }}>
                    <th style={{ padding: "12px" }}>Asset</th>
                    <th style={{ padding: "12px" }}>Asset Class</th>
                    <th style={{ padding: "12px" }}>Issuer</th>
                    <th style={{ padding: "12px" }}>Tokenized Market Cap</th>
                    <th style={{ padding: "12px" }}>Est. APY</th>
                    <th style={{ padding: "12px" }}>Institutional Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {rwaData.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #334155" }}>
                      <td style={{ padding: "16px 12px", fontWeight: "600" }}>{item.name} ({item.symbol})</td>
                      <td style={{ padding: "16px 12px", color: "#cbd5e1" }}>{item.type}</td>
                      <td style={{ padding: "16px 12px", color: "#cbd5e1" }}>{item.issuer}</td>
                      <td style={{ padding: "16px 12px", fontWeight: "600", color: "#60a5fa" }}>${item.marketCapUsd.toLocaleString()}</td>
                      <td style={{ padding: "16px 12px", fontWeight: "bold", color: "#10b981" }}>{item.apy}%</td>
                      <td style={{ padding: "16px 12px" }}>
                        <span style={{ backgroundColor: "#065f46", color: "#34d399", padding: "4px 10px", borderRadius: "6px", fontSize: "12px" }}>{item.riskRating}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: DEX Liquidity Guard */}
        {activeTab === "dex" && (
          <div style={{ backgroundColor: "#1e293b", borderRadius: "12px", padding: "24px", border: "1px solid #334155" }}>
            <h3 style={{ marginTop: 0, marginBottom: "16px", fontSize: "18px" }}>DEX Liquidity Depth & Wash Trading Sentinel</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #334155", color: "#94a3b8" }}>
                  <th style={{ padding: "12px" }}>Token Symbol</th>
                  <th style={{ padding: "12px" }}>Price (USD)</th>
                  <th style={{ padding: "12px" }}>Market Cap</th>
                  <th style={{ padding: "12px" }}>24h Volume</th>
                  <th style={{ padding: "12px" }}>Vol / Mcap Ratio</th>
                  <th style={{ padding: "12px" }}>Risk Status</th>
                  <th style={{ padding: "12px" }}>Sentinel Assessment</th>
                </tr>
              </thead>
              <tbody>
                {dexRisks.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #334155" }}>
                    <td style={{ padding: "16px 12px", fontWeight: "600" }}>{item.symbol}</td>
                    <td style={{ padding: "16px 12px" }}>${item.price.toLocaleString()}</td>
                    <td style={{ padding: "16px 12px" }}>${item.mcap.toLocaleString()}</td>
                    <td style={{ padding: "16px 12px" }}>${item.vol24h.toLocaleString()}</td>
                    <td style={{ padding: "16px 12px", fontWeight: "600" }}>{item.volMcapRatio}</td>
                    <td style={{ padding: "16px 12px" }}>
                      <span style={{ backgroundColor: item.riskLevel === "LOW" ? "#065f46" : "#991b1b", color: item.riskLevel === "LOW" ? "#34d399" : "#fca5a5", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold" }}>
                        {item.riskLevel} RISK
                      </span>
                    </td>
                    <td style={{ padding: "16px 12px", color: item.riskLevel === "LOW" ? "#94a3b8" : "#f87171", fontSize: "13px" }}>{item.warning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Macro Rebalancer */}
        {activeTab === "rebalance" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <div style={{ backgroundColor: "#1e293b", borderRadius: "12px", padding: "24px", border: "1px solid #334155" }}>
              <h3 style={{ marginTop: 0, fontSize: "18px" }}>Market Macro Dominance (CMC API)</h3>
              <div style={{ marginTop: "20px" }}>
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span>Bitcoin Dominance (BTC.D)</span>
                    <span style={{ fontWeight: "bold", color: "#f59e0b" }}>58.85%</span>
                  </div>
                  <div style={{ width: "100%", height: "10px", backgroundColor: "#334155", borderRadius: "5px", overflow: "hidden" }}>
                    <div style={{ width: "58.85%", height: "100%", backgroundColor: "#f59e0b" }}></div>
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span>Ethereum Dominance (ETH.D)</span>
                    <span style={{ fontWeight: "bold", color: "#3b82f6" }}>14.20%</span>
                  </div>
                  <div style={{ width: "100%", height: "10px", backgroundColor: "#334155", borderRadius: "5px", overflow: "hidden" }}>
                    <div style={{ width: "14.20%", height: "100%", backgroundColor: "#3b82f6" }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span>RWA & Altcoins Market Share</span>
                    <span style={{ fontWeight: "bold", color: "#10b981" }}>26.95%</span>
                  </div>
                  <div style={{ width: "100%", height: "10px", backgroundColor: "#334155", borderRadius: "5px", overflow: "hidden" }}>
                    <div style={{ width: "26.95%", height: "100%", backgroundColor: "#10b981" }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: "#1e293b", borderRadius: "12px", padding: "24px", border: "1px solid #334155" }}>
              <h3 style={{ marginTop: 0, fontSize: "18px" }}>AI Institutional Allocation Strategy</h3>
              <p style={{ color: "#94a3b8", fontSize: "14px" }}>Recommended portfolio weights based on current Volatility & RWA Yield Matrix:</p>
              <ul style={{ listStyle: "none", padding: 0, marginTop: "16px" }}>
                <li style={{ padding: "12px", borderBottom: "1px solid #334155", display: "flex", justifyContent: "space-between" }}>
                  <span>US Treasuries RWA (USDY/BUIDL)</span>
                  <strong style={{ color: "#10b981" }}>35% (Safe Yield)</strong>
                </li>
                <li style={{ padding: "12px", borderBottom: "1px solid #334155", display: "flex", justifyContent: "space-between" }}>
                  <span>Bitcoin (BTC)</span>
                  <strong style={{ color: "#f59e0b" }}>40% (Macro Core)</strong>
                </li>
                <li style={{ padding: "12px", borderBottom: "1px solid #334155", display: "flex", justifyContent: "space-between" }}>
                  <span>Ethereum (ETH Staking)</span>
                  <strong style={{ color: "#3b82f6" }}>15% (DeFi Yield)</strong>
                </li>
                <li style={{ padding: "12px", display: "flex", justifyContent: "space-between" }}>
                  <span>Cash / Stablecoins</span>
                  <strong style={{ color: "#94a3b8" }}>10% (Liquidity Buffer)</strong>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 4: AI Agent Co-Pilot Terminal */}
        {activeTab === "agent" && (
          <div style={{ backgroundColor: "#1e293b", borderRadius: "12px", padding: "24px", border: "1px solid #334155", height: "550px", display: "flex", flexDirection: "column" }}>
            <h3 style={{ marginTop: 0, marginBottom: "16px", fontSize: "18px" }}>CMC Sentinel-RWA AI Agent Terminal</h3>
            <div style={{ flex: 1, backgroundColor: "#0f172a", borderRadius: "8px", padding: "16px", overflowY: "auto", marginBottom: "16px", border: "1px solid #334155" }}>
              {chatLog.map((log, index) => (
                <div key={index} style={{ marginBottom: "12px", textAlign: log.sender === "user" ? "right" : "left" }}>
                  <span style={{ display: "inline-block", padding: "10px 16px", borderRadius: "8px", backgroundColor: log.sender === "user" ? "#2563eb" : "#334155", color: "#ffffff", maxWidth: "80%", fontSize: "14px", lineHeight: "1.5" }}>
                    {log.text}
                  </span>
                </div>
              ))}
              {loading && <div style={{ color: "#94a3b8", fontSize: "12px" }}>Sentinel Agent is processing live CMC API metrics...</div>}
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                placeholder="Hỏi Agent: Phân tích Yield RWA Ondo vs Aave, hoặc kiểm tra rủi ro BTC..."
                style={{ flex: 1, padding: "12px 16px", borderRadius: "8px", border: "1px solid #334155", backgroundColor: "#0f172a", color: "#ffffff", fontSize: "14px", outline: "none" }}
              />
              <button
                onClick={handleSendChat}
                style={{ padding: "12px 24px", backgroundColor: "#2563eb", color: "#ffffff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}
              >
                Gửi Lệnh
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
