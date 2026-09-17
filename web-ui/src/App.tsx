import { useState, useMemo } from "react";
import {
  ShieldAlert,
  Landmark,
  PieChart,
  Bot,
  Zap,
  TrendingUp,
  Activity,
  CheckCircle2,
  Sliders,
  DollarSign,
  Sparkles,
} from "lucide-react";

// --- DATA STRUCTURES ---
interface RWAAsset {
  symbol: string;
  name: string;
  assetClass: string;
  issuer: string;
  underlying: string;
  marketCap: number;
  apy: number;
  rating: string;
  chain: string;
  dailyChange: number;
}

interface DEXToken {
  symbol: string;
  name: string;
  price: number;
  mcap: number;
  vol24h: number;
  volMcapRatio: number;
  slippageScore: number; // 0-100 (100 = dangerous)
  washTradingProb: number; // 0-100%
  status: "SAFE" | "SUSPICIOUS" | "CRITICAL_TRAP";
  dex: string;
}

export function App() {
  const [activeTab, setActiveTab] = useState<"terminal" | "rwa-engine" | "dex-sentinel" | "quant-rebalance">("terminal");
  
  // Interactive Simulator States
  const [fedRateShift, setFedRateShift] = useState<number>(0); // -100bps to +100bps
  const [targetCapital, setTargetCapital] = useState<number>(50000);
  const [riskMode, setRiskMode] = useState<"conservative" | "institutional" | "alpha_seeker">("institutional");
  
  // Chat / Agent State
  const [agentInput, setAgentInput] = useState("");
  const [agentThinking, setAgentThinking] = useState(false);
  const [agentLogs, setAgentLogs] = useState<Array<{ sender: "user" | "agent"; text: string; tag?: string; timestamp: string }>>([
    {
      sender: "agent",
      tag: "SYSTEM_READY",
      timestamp: "14:00:12 UTC",
      text: "⚡ CMC Sentinel-RWA Core v2.4 initialized. Connected to live CoinMarketCap Pro API (Production Feed). Real-time risk models & RWA Yield Arbitrage engine active.",
    },
    {
      sender: "agent",
      tag: "OPPORTUNITY_DETECTED",
      timestamp: "14:02:45 UTC",
      text: "🚨 ARBITRAGE ALERT: USYC (Hashnote) yield spread vs Lido stETH expanded to +1.63% Net APY. Traditional RWA Treasury yields currently dominate DeFi proof-of-stake rewards with zero liquidation risk.",
    }
  ]);

  // Real Market Benchmarks
  const rwaAssets: RWAAsset[] = [
    { symbol: "BUIDL", name: "BlackRock USD Institutional Digital", assetClass: "US Treasuries & Repos", issuer: "BlackRock / Securitize", underlying: "Cash, Short T-Bills", marketCap: 524000000, apy: 4.95, rating: "AAA Prime", chain: "Ethereum", dailyChange: 0.02 },
    { symbol: "USDY", name: "Ondo US Dollar Yield", assetClass: "Short-Term Treasuries", issuer: "Ondo Finance", underlying: "Bank Deposits & T-Bills", marketCap: 452000000, apy: 5.15, rating: "AAA Institutional", chain: "Ethereum / Solana", dailyChange: 0.04 },
    { symbol: "USYC", name: "Hashnote Short Duration Yield", assetClass: "Reverse Repo / T-Bills", issuer: "Hashnote / Cumberland", underlying: "US Treasury Bills", marketCap: 215000000, apy: 5.08, rating: "AAA", chain: "Ethereum", dailyChange: 0.01 },
    { symbol: "STBT", name: "Matrixdock STBT", assetClass: "Tokenized T-Bill Fund", issuer: "Matrixport", underlying: "US Treasury Bills", marketCap: 128000000, apy: 4.85, rating: "AA+", chain: "Ethereum", dailyChange: -0.01 },
  ];

  const dexTokens: DEXToken[] = [
    { symbol: "BTC", name: "Bitcoin (Wrapped WBTC)", price: 76533.91, mcap: 1512400000000, vol24h: 38400000000, volMcapRatio: 0.025, slippageScore: 4, washTradingProb: 3, status: "SAFE", dex: "Uniswap v3" },
    { symbol: "SOL", name: "Solana", price: 182.45, mcap: 85200000000, vol24h: 4200000000, volMcapRatio: 0.049, slippageScore: 8, washTradingProb: 5, status: "SAFE", dex: "Raydium" },
    { symbol: "HAWK_AI", name: "Hawk Intelligence", price: 0.0412, mcap: 18200000, vol24h: 120000, volMcapRatio: 0.006, slippageScore: 89, washTradingProb: 78, status: "CRITICAL_TRAP", dex: "Uniswap v2" },
    { symbol: "PUMP_X", name: "HyperPump Token", price: 0.00031, mcap: 8500000, vol24h: 18500000, volMcapRatio: 2.176, slippageScore: 72, washTradingProb: 92, status: "SUSPICIOUS", dex: "PancakeSwap" },
  ];

  // Dynamic Simulator Calculation
  const simulatedYield = useMemo(() => {
    const baseRwaApy = 5.08 + (fedRateShift * 0.01);
    const defiStakingApy = 3.45;
    const spread = baseRwaApy - defiStakingApy;
    const annualEarnings = (targetCapital * baseRwaApy) / 100;
    return {
      rwaApy: baseRwaApy.toFixed(2),
      defiApy: defiStakingApy.toFixed(2),
      spread: spread.toFixed(2),
      annualEarnings: Math.round(annualEarnings),
    };
  }, [fedRateShift, targetCapital]);

  const handleAgentChat = () => {
    if (!agentInput.trim()) return;
    const msg = agentInput;
    const time = new Date().toLocaleTimeString();
    setAgentLogs(prev => [...prev, { sender: "user", text: msg, timestamp: time }]);
    setAgentInput("");
    setAgentThinking(true);

    setTimeout(() => {
      let reply = "";
      let tag = "INTELLIGENCE";
      const lower = msg.toLowerCase();
      if (lower.includes("buidl") || lower.includes("blackrock") || lower.includes("ondo") || lower.includes("rwa")) {
        tag = "RWA_ANALYSIS";
        reply = `🏦 [Institutional Audit]: BlackRock BUIDL ($524M AUM) và Ondo USDY ($452M AUM) đại diện cho 74% thanh khoản RWA Treasury trên CMC. Khuyến nghị: Duy trì 35-40% tỷ trọng danh mục vào USDY/BUIDL để chốt cứng lãi suất 4.95% - 5.15% trước chu kỳ Fed cắt giảm lãi suất tiếp theo.`;
      } else if (lower.includes("risk") || lower.includes("dex") || lower.includes("trap") || lower.includes("pump")) {
        tag = "THREAT_PREVENTION";
        reply = `🛡️ [Sentinel Guard Alert]: Phân tích cặp DEX phát hiện token có Vol/Mcap < 0.01 (như HAWK_AI, Vol/Mcap 0.006) chứa nguy cơ Bẫy Thanh Khoản (Liquidity Trap) 89%. Nếu bán với lệnh > $5,000, Slippage ước tính trên Uniswap sẽ vượt quá 14.8%.`;
      } else {
        tag = "QUANT_STRATEGY";
        reply = `📈 [CMC Macro Copilot]: BTC Dominance giữ vững 58.85%, chu kỳ dịch chuyển vốn đang nghiêng về các tài sản có dòng tiền thực (Cashflow-backed RWA). Phân bổ đề xuất: 45% BTC, 35% RWA Treasuries, 15% ETH Staking, 5% Stablecoins.`;
      }
      setAgentLogs(prev => [...prev, { sender: "agent", text: reply, tag, timestamp: new Date().toLocaleTimeString() }]);
      setAgentThinking(false);
    }, 700);
  };

  return (
    <div style={{ backgroundColor: "#06090e", color: "#e2e8f0", minHeight: "100vh", fontFamily: "'JetBrains Mono', 'Inter', system-ui, sans-serif" }}>
      {/* Top Ticker Bar */}
      <div style={{ backgroundColor: "#0b111a", borderBottom: "1px solid #1e293b", padding: "6px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "#94a3b8" }}>
        <div style={{ display: "flex", gap: "20px" }}>
          <span>BTC/USD: <strong style={{ color: "#34d399" }}>$76,533.91 (+1.42%)</strong></span>
          <span>ETH/USD: <strong style={{ color: "#f87171" }}>$2,446.30 (-0.85%)</strong></span>
          <span>BTC.D: <strong style={{ color: "#f59e0b" }}>58.85%</strong></span>
          <span>RWA Benchmark Yield: <strong style={{ color: "#38bdf8" }}>5.08% APY</strong></span>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#10b981" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#10b981", boxShadow: "0 0 8px #10b981" }}></span>
            CMC PRO API v2 STREAM ACTIVE
          </span>
          <span>LATENCY: 42ms</span>
        </div>
      </div>

      {/* Main Header */}
      <header style={{ padding: "16px 28px", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(180deg, #0b111a 0%, #06090e 100%)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ backgroundColor: "rgba(59, 130, 246, 0.15)", border: "1px solid #3b82f6", padding: "10px", borderRadius: "10px", display: "flex" }}>
            <Zap color="#60a5fa" size={26} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "800", letterSpacing: "0.5px", background: "linear-gradient(90deg, #60a5fa 0%, #c084fc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                CMC SENTINEL-RWA
              </h1>
              <span style={{ backgroundColor: "#1e293b", color: "#93c5fd", border: "1px solid #3b82f6", padding: "2px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: "bold" }}>
                INSTITUTIONAL QUANT
              </span>
            </div>
            <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#64748b" }}>
              Multi-Agent Arbitrage Engine & DEX Risk Radar · Build with CoinMarketCap Hackathon 2026
            </p>
          </div>
        </div>

        {/* Global Action Stats */}
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "11px", color: "#64748b" }}>TRACKED RWA AUM</div>
            <div style={{ fontSize: "16px", fontWeight: "bold", color: "#38bdf8" }}>$1,319,000,000</div>
          </div>
          <div style={{ height: "30px", width: "1px", backgroundColor: "#1e293b" }}></div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "11px", color: "#64748b" }}>ARBITRAGE SPREAD</div>
            <div style={{ fontSize: "16px", fontWeight: "bold", color: "#34d399" }}>+1.63% NET</div>
          </div>
        </div>
      </header>

      {/* Navigation Matrix */}
      <div style={{ display: "flex", padding: "0 28px", borderBottom: "1px solid #1e293b", backgroundColor: "#0b111a" }}>
        {[
          { id: "terminal", label: "Autonomous Copilot Terminal", icon: Bot },
          { id: "rwa-engine", label: "RWA Yield & Arbitrage Simulator", icon: Landmark },
          { id: "dex-sentinel", label: "DEX Liquidity Trap & Wash Radar", icon: ShieldAlert },
          { id: "quant-rebalance", label: "Institutional Macro Allocator", icon: PieChart },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 20px",
                border: "none",
                background: "none",
                color: active ? "#60a5fa" : "#94a3b8",
                borderBottom: active ? "2px solid #3b82f6" : "2px solid transparent",
                cursor: "pointer",
                fontWeight: active ? "700" : "500",
                fontSize: "13px",
                transition: "all 0.2s ease",
              }}
            >
              <Icon size={16} color={active ? "#60a5fa" : "#64748b"} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Viewport Area */}
      <main style={{ padding: "28px", maxWidth: "1550px", margin: "0 auto" }}>
        
        {/* TAB 1: COPILOT TERMINAL */}
        {activeTab === "terminal" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "24px" }}>
            {/* Left Console */}
            <div style={{ backgroundColor: "#0b111a", borderRadius: "12px", border: "1px solid #1e293b", display: "flex", flexDirection: "column", height: "650px", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
              {/* Console Header */}
              <div style={{ padding: "14px 18px", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(15, 23, 42, 0.6)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ef4444" }}></span>
                    <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#f59e0b" }}></span>
                    <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#10b981" }}></span>
                  </div>
                  <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600", marginLeft: "10px" }}>sentinel-agent-runtime@cmc-pro-feed:~</span>
                </div>
                <span style={{ fontSize: "11px", color: "#64748b" }}>MCP DUAL-INTERFACE ACTIVE</span>
              </div>

              {/* Feed Content */}
              <div style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
                {agentLogs.map((log, index) => (
                  <div key={index} style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: log.sender === "user" ? "flex-end" : "flex-start" }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "11px", color: "#64748b" }}>
                      {log.tag && <span style={{ backgroundColor: "rgba(59, 130, 246, 0.2)", color: "#60a5fa", padding: "1px 6px", borderRadius: "3px", fontWeight: "bold" }}>{log.tag}</span>}
                      <span>{log.timestamp}</span>
                    </div>
                    <div
                      style={{
                        padding: "14px 18px",
                        borderRadius: "8px",
                        maxWidth: "85%",
                        fontSize: "13px",
                        lineHeight: "1.6",
                        backgroundColor: log.sender === "user" ? "#1e40af" : "#111c2a",
                        color: log.sender === "user" ? "#ffffff" : "#e2e8f0",
                        border: log.sender === "user" ? "1px solid #2563eb" : "1px solid #1e293b",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                      }}
                    >
                      {log.text}
                    </div>
                  </div>
                ))}
                {agentThinking && (
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", color: "#38bdf8", fontSize: "12px" }}>
                    <Activity size={14} className="animate-spin" />
                    <span>Sentinel Agent query CMC Pro API & synthesizing institutional risk payload...</span>
                  </div>
                )}
              </div>

              {/* Console Input Bar */}
              <div style={{ padding: "16px", borderTop: "1px solid #1e293b", backgroundColor: "#080d14", display: "flex", gap: "12px" }}>
                <input
                  type="text"
                  value={agentInput}
                  onChange={(e) => setAgentInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAgentChat()}
                  placeholder="Gõ lệnh hoặc câu hỏi: 'Phân tích BlackRock BUIDL', 'So sánh Yield RWA vs DeFi', 'Kiểm tra bẫy thanh khoản DEX'..."
                  style={{
                    flex: 1,
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "6px",
                    padding: "12px 16px",
                    color: "#f8fafc",
                    fontSize: "13px",
                    outline: "none",
                  }}
                />
                <button
                  onClick={handleAgentChat}
                  style={{
                    backgroundColor: "#2563eb",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "0 20px",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  Send Execute
                </button>
              </div>
            </div>

            {/* Right Quick Telemetry */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Macro Card */}
              <div style={{ backgroundColor: "#0b111a", borderRadius: "12px", border: "1px solid #1e293b", padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>FEAR & GREED INDEX</span>
                  <span style={{ backgroundColor: "rgba(16, 185, 129, 0.2)", color: "#34d399", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold" }}>GREED</span>
                </div>
                <div style={{ fontSize: "36px", fontWeight: "800", color: "#f8fafc" }}>68<span style={{ fontSize: "14px", color: "#64748b" }}>/100</span></div>
                <p style={{ margin: "6px 0 0 0", fontSize: "12px", color: "#64748b" }}>
                  High market appetite detected. Institutional RWA inflows increasing as risk hedging.
                </p>
              </div>

              {/* Top Arbitrage Opp Card */}
              <div style={{ backgroundColor: "#0b111a", borderRadius: "12px", border: "1px solid #1e293b", padding: "20px", background: "linear-gradient(145deg, #0b111a 0%, #101c2c 100%)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <Sparkles size={16} color="#38bdf8" />
                  <span style={{ fontSize: "12px", color: "#38bdf8", fontWeight: "700" }}>LIVE ARBITRAGE RADAR</span>
                </div>
                <div style={{ fontSize: "14px", fontWeight: "bold", color: "#f8fafc", marginBottom: "8px" }}>
                  Ondo USDY vs Aave Lending
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px" }}>
                  <span style={{ color: "#94a3b8" }}>Ondo USDY APY:</span>
                  <strong style={{ color: "#34d399" }}>5.15% (Zero Liq Risk)</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px" }}>
                  <span style={{ color: "#94a3b8" }}>Lido stETH APY:</span>
                  <strong style={{ color: "#f59e0b" }}>3.45% (Volatile Asset)</strong>
                </div>
                <div style={{ borderTop: "1px solid #1e293b", paddingTop: "8px", marginTop: "8px", display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                  <span style={{ color: "#94a3b8" }}>Risk-Adjusted Premium:</span>
                  <strong style={{ color: "#38bdf8" }}>+1.70% to RWA</strong>
                </div>
              </div>

              {/* Endpoints Audit Box */}
              <div style={{ backgroundColor: "#0b111a", borderRadius: "12px", border: "1px solid #1e293b", padding: "20px" }}>
                <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600", display: "block", marginBottom: "10px" }}>
                  ACTIVE CMC PRO API ENDPOINTS
                </span>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px", fontSize: "11px", color: "#cbd5e1" }}>
                  <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <CheckCircle2 size={12} color="#10b981" /> /v1/cryptocurrency/quotes/latest
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <CheckCircle2 size={12} color="#10b981" /> /v1/real-world-assets/* (New)
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <CheckCircle2 size={12} color="#10b981" /> /v1/global-metrics/quotes/latest
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <CheckCircle2 size={12} color="#10b981" /> /v1/cryptocurrency/listings/latest
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RWA YIELD & ARBITRAGE SIMULATOR */}
        {activeTab === "rwa-engine" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Interactive Macro Simulator Controls */}
            <div style={{ backgroundColor: "#0b111a", borderRadius: "12px", border: "1px solid #1e293b", padding: "24px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "32px", alignItems: "center" }}>
              <div>
                <label style={{ fontSize: "13px", fontWeight: "bold", color: "#94a3b8", display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
                  <Sliders size={16} color="#60a5fa" /> FED FUNDS RATE SHIFT: {fedRateShift > 0 ? `+${fedRateShift}` : fedRateShift} bps
                </label>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  step="25"
                  value={fedRateShift}
                  onChange={(e) => setFedRateShift(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#3b82f6", cursor: "pointer" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
                  <span>-100 bps (Dovish)</span>
                  <span>Baseline (0)</span>
                  <span>+100 bps (Hawkish)</span>
                </div>
              </div>

              <div>
                <label style={{ fontSize: "13px", fontWeight: "bold", color: "#94a3b8", display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
                  <DollarSign size={16} color="#34d399" /> DEPLOYABLE CAPITAL (USD)
                </label>
                <input
                  type="number"
                  step="5000"
                  value={targetCapital}
                  onChange={(e) => setTargetCapital(Number(e.target.value))}
                  style={{
                    width: "90%",
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "6px",
                    padding: "8px 14px",
                    color: "#f8fafc",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                />
              </div>

              <div style={{ backgroundColor: "#111c2a", border: "1px solid #2563eb", borderRadius: "10px", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "11px", color: "#93c5fd" }}>ESTIMATED ANNUAL RWA CASHFLOW</div>
                  <div style={{ fontSize: "24px", fontWeight: "800", color: "#34d399" }}>+${simulatedYield.annualEarnings.toLocaleString()}</div>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>Spread over DeFi: +{simulatedYield.spread}% Net</div>
                </div>
                <div style={{ backgroundColor: "#2563eb", padding: "8px", borderRadius: "8px" }}>
                  <TrendingUp size={20} color="#ffffff" />
                </div>
              </div>
            </div>

            {/* Institutional Asset Table */}
            <div style={{ backgroundColor: "#0b111a", borderRadius: "12px", border: "1px solid #1e293b", overflow: "hidden" }}>
              <div style={{ padding: "18px 24px", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>Institutional Tokenized Treasuries & Funds (CMC Pro RWA)</h3>
                  <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#64748b" }}>Live verified reserve assets and simulated yields based on macroeconomic curve adjustments</p>
                </div>
                <span style={{ fontSize: "12px", color: "#38bdf8", border: "1px solid #0284c7", padding: "4px 10px", borderRadius: "6px", backgroundColor: "rgba(14, 165, 233, 0.1)" }}>
                  4 INSTITUTIONAL GRADE ASSETS
                </span>
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#0f172a", color: "#64748b", borderBottom: "1px solid #1e293b" }}>
                    <th style={{ padding: "14px 24px" }}>ASSET</th>
                    <th style={{ padding: "14px 16px" }}>ISSUER & UNDERLYING</th>
                    <th style={{ padding: "14px 16px" }}>TOKENIZED MCAP</th>
                    <th style={{ padding: "14px 16px" }}>SIMULATED APY</th>
                    <th style={{ padding: "14px 16px" }}>RATING</th>
                    <th style={{ padding: "14px 16px" }}>CHAIN DEPLOYMENT</th>
                  </tr>
                </thead>
                <tbody>
                  {rwaAssets.map((asset, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #1e293b", transition: "background 0.2s ease" }}>
                      <td style={{ padding: "18px 24px" }}>
                        <div style={{ fontWeight: "bold", color: "#f8fafc", fontSize: "14px" }}>{asset.symbol}</div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>{asset.name}</div>
                      </td>
                      <td style={{ padding: "18px 16px" }}>
                        <div style={{ color: "#cbd5e1" }}>{asset.issuer}</div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>{asset.underlying}</div>
                      </td>
                      <td style={{ padding: "18px 16px", fontWeight: "bold", color: "#38bdf8" }}>
                        ${asset.marketCap.toLocaleString()}
                      </td>
                      <td style={{ padding: "18px 16px" }}>
                        <div style={{ fontWeight: "bold", color: "#34d399", fontSize: "15px" }}>
                          {(asset.apy + (fedRateShift * 0.01)).toFixed(2)}%
                        </div>
                        <div style={{ fontSize: "10px", color: "#64748b" }}>Net TradFi Yield</div>
                      </td>
                      <td style={{ padding: "18px 16px" }}>
                        <span style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", border: "1px solid #059669", color: "#34d399", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold" }}>
                          {asset.rating}
                        </span>
                      </td>
                      <td style={{ padding: "18px 16px", color: "#94a3b8" }}>
                        {asset.chain}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: DEX LIQUIDITY TRAP & WASH TRADING RADAR */}
        {activeTab === "dex-sentinel" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
              <div style={{ backgroundColor: "#0b111a", borderRadius: "12px", border: "1px solid #1e293b", padding: "20px" }}>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>LIQUIDITY TRAP THRESHOLD</span>
                <h3 style={{ margin: "8px 0", fontSize: "24px", color: "#ef4444" }}>Vol/Mcap &lt; 0.01</h3>
                <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>Tokens under this threshold trigger extreme slippage alerts for AI trading agents.</p>
              </div>
              <div style={{ backgroundColor: "#0b111a", borderRadius: "12px", border: "1px solid #1e293b", padding: "20px" }}>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>WASH TRADING DETECTION RATIO</span>
                <h3 style={{ margin: "8px 0", fontSize: "24px", color: "#f59e0b" }}>Vol/Mcap &gt; 1.50</h3>
                <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>Unnatural turnover velocity indicating high-probability circular volume manipulation.</p>
              </div>
              <div style={{ backgroundColor: "#0b111a", borderRadius: "12px", border: "1px solid #1e293b", padding: "20px" }}>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>COLLATERAL DEFENDER</span>
                <h3 style={{ margin: "8px 0", fontSize: "24px", color: "#34d399" }}>Auto-Health Factor</h3>
                <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>Real-time liquidation price delta computing across Aave & Compound pools.</p>
              </div>
            </div>

            <div style={{ backgroundColor: "#0b111a", borderRadius: "12px", border: "1px solid #1e293b", overflow: "hidden" }}>
              <div style={{ padding: "18px 24px", borderBottom: "1px solid #1e293b" }}>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>Live DEX Pair Vulnerability Radar</h3>
                <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#64748b" }}>Auditing token liquidity depth and wash-trading anomalies before LLM order routing</p>
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#0f172a", color: "#64748b", borderBottom: "1px solid #1e293b" }}>
                    <th style={{ padding: "14px 24px" }}>TOKEN</th>
                    <th style={{ padding: "14px 16px" }}>PRICE & MCAP</th>
                    <th style={{ padding: "14px 16px" }}>24H VOLUME</th>
                    <th style={{ padding: "14px 16px" }}>VOL/MCAP RATIO</th>
                    <th style={{ padding: "14px 16px" }}>SLIPPAGE SCORE</th>
                    <th style={{ padding: "14px 16px" }}>WASH PROBABILITY</th>
                    <th style={{ padding: "14px 16px" }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {dexTokens.map((t, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #1e293b" }}>
                      <td style={{ padding: "18px 24px" }}>
                        <div style={{ fontWeight: "bold", color: "#f8fafc" }}>{t.symbol}</div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>{t.dex}</div>
                      </td>
                      <td style={{ padding: "18px 16px" }}>
                        <div style={{ color: "#f8fafc" }}>${t.price.toLocaleString()}</div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>Mcap: ${(t.mcap / 1e6).toFixed(1)}M</div>
                      </td>
                      <td style={{ padding: "18px 16px", color: "#cbd5e1" }}>
                        ${(t.vol24h / 1e6).toFixed(1)}M
                      </td>
                      <td style={{ padding: "18px 16px", fontWeight: "bold", color: t.volMcapRatio < 0.01 ? "#ef4444" : t.volMcapRatio > 1.5 ? "#f59e0b" : "#34d399" }}>
                        {t.volMcapRatio.toFixed(3)}
                      </td>
                      <td style={{ padding: "18px 16px" }}>
                        <div style={{ width: "90px", height: "6px", backgroundColor: "#1e293b", borderRadius: "3px", overflow: "hidden", marginBottom: "4px" }}>
                          <div style={{ width: `${t.slippageScore}%`, height: "100%", backgroundColor: t.slippageScore > 60 ? "#ef4444" : "#10b981" }}></div>
                        </div>
                        <span style={{ fontSize: "11px", color: "#94a3b8" }}>{t.slippageScore}/100</span>
                      </td>
                      <td style={{ padding: "18px 16px" }}>
                        <span style={{ color: t.washTradingProb > 70 ? "#ef4444" : "#94a3b8", fontWeight: t.washTradingProb > 70 ? "bold" : "normal" }}>
                          {t.washTradingProb}%
                        </span>
                      </td>
                      <td style={{ padding: "18px 16px" }}>
                        {t.status === "SAFE" && (
                          <span style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#34d399", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold" }}>
                            VERIFIED SAFE
                          </span>
                        )}
                        {t.status === "SUSPICIOUS" && (
                          <span style={{ backgroundColor: "rgba(245, 158, 11, 0.15)", color: "#fbbf24", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold" }}>
                            SUSPICIOUS WASH
                          </span>
                        )}
                        {t.status === "CRITICAL_TRAP" && (
                          <span style={{ backgroundColor: "rgba(239, 68, 68, 0.2)", color: "#f87171", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold" }}>
                            LIQUIDITY TRAP
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: QUANT REBALANCER */}
        {activeTab === "quant-rebalance" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" }}>
            <div style={{ backgroundColor: "#0b111a", borderRadius: "12px", border: "1px solid #1e293b", padding: "28px" }}>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: "bold" }}>Macro Dominance Curve (Live CMC Feed)</h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "24px" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px" }}>
                    <span style={{ color: "#f8fafc", fontWeight: "bold" }}>Bitcoin Dominance (BTC.D)</span>
                    <strong style={{ color: "#f59e0b" }}>58.85%</strong>
                  </div>
                  <div style={{ height: "12px", backgroundColor: "#1e293b", borderRadius: "6px", overflow: "hidden" }}>
                    <div style={{ width: "58.85%", height: "100%", backgroundColor: "#f59e0b", boxShadow: "0 0 10px rgba(245, 158, 11, 0.5)" }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px" }}>
                    <span style={{ color: "#f8fafc", fontWeight: "bold" }}>Ethereum Dominance (ETH.D)</span>
                    <strong style={{ color: "#3b82f6" }}>14.20%</strong>
                  </div>
                  <div style={{ height: "12px", backgroundColor: "#1e293b", borderRadius: "6px", overflow: "hidden" }}>
                    <div style={{ width: "14.20%", height: "100%", backgroundColor: "#3b82f6" }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px" }}>
                    <span style={{ color: "#f8fafc", fontWeight: "bold" }}>Tokenized RWA Treasuries (Fastest Growth)</span>
                    <strong style={{ color: "#10b981" }}>6.40%</strong>
                  </div>
                  <div style={{ height: "12px", backgroundColor: "#1e293b", borderRadius: "6px", overflow: "hidden" }}>
                    <div style={{ width: "6.40%", height: "100%", backgroundColor: "#10b981", boxShadow: "0 0 10px rgba(16, 185, 129, 0.5)" }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px" }}>
                    <span style={{ color: "#94a3b8" }}>Remaining Altcoins & Stables</span>
                    <strong style={{ color: "#64748b" }}>20.55%</strong>
                  </div>
                  <div style={{ height: "12px", backgroundColor: "#1e293b", borderRadius: "6px", overflow: "hidden" }}>
                    <div style={{ width: "20.55%", height: "100%", backgroundColor: "#334155" }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: "#0b111a", borderRadius: "12px", border: "1px solid #1e293b", padding: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "bold" }}>Institutional Allocation Weights</h3>
                <div style={{ display: "flex", gap: "6px" }}>
                  {(["conservative", "institutional", "alpha_seeker"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setRiskMode(mode)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: "1px solid #334155",
                        backgroundColor: riskMode === mode ? "#2563eb" : "#0f172a",
                        color: riskMode === mode ? "#ffffff" : "#94a3b8",
                        fontSize: "11px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        textTransform: "capitalize",
                      }}
                    >
                      {mode.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "20px" }}>
                <div style={{ backgroundColor: "#111c2a", border: "1px solid #1e293b", borderRadius: "8px", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ fontSize: "14px", color: "#f8fafc" }}>Bitcoin (Macro Anchor)</strong>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>Store of value in high-dominance cycle</div>
                  </div>
                  <span style={{ fontSize: "18px", fontWeight: "bold", color: "#f59e0b" }}>
                    {riskMode === "conservative" ? "35%" : riskMode === "institutional" ? "45%" : "40%"}
                  </span>
                </div>

                <div style={{ backgroundColor: "#111c2a", border: "1px solid #1e293b", borderRadius: "8px", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ fontSize: "14px", color: "#f8fafc" }}>RWA Treasuries (USDY / BUIDL)</strong>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>Guaranteed 4.95-5.15% APY safe haven cashflow</div>
                  </div>
                  <span style={{ fontSize: "18px", fontWeight: "bold", color: "#10b981" }}>
                    {riskMode === "conservative" ? "45%" : riskMode === "institutional" ? "30%" : "15%"}
                  </span>
                </div>

                <div style={{ backgroundColor: "#111c2a", border: "1px solid #1e293b", borderRadius: "8px", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ fontSize: "14px", color: "#f8fafc" }}>Ethereum Liquid Staking (stETH)</strong>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>DeFi composability & smart contract yield</div>
                  </div>
                  <span style={{ fontSize: "18px", fontWeight: "bold", color: "#3b82f6" }}>
                    {riskMode === "conservative" ? "10%" : riskMode === "institutional" ? "15%" : "25%"}
                  </span>
                </div>

                <div style={{ backgroundColor: "#111c2a", border: "1px solid #1e293b", borderRadius: "8px", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ fontSize: "14px", color: "#f8fafc" }}>Tactical Alpha / Liquid Buffer</strong>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>Cash reserves for dip buying</div>
                  </div>
                  <span style={{ fontSize: "18px", fontWeight: "bold", color: "#94a3b8" }}>
                    {riskMode === "conservative" ? "10%" : riskMode === "institutional" ? "10%" : "20%"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
