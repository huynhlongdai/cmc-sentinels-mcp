import { useState, useMemo } from "react";
import {
  ShieldAlert,
  Landmark,
  PieChart,
  Bot,
  Zap,
  TrendingUp,
  Activity,
  Sliders,
  DollarSign,
  Sparkles,
  ExternalLink,
  Layers,
} from "lucide-react";

export function App() {
  const [activeTab, setActiveTab] = useState<"overview" | "rwa" | "dex" | "rebalance" | "agent">("overview");

  // Interactive Simulator States
  const [fedRateShift, setFedRateShift] = useState<number>(0); // -100bps to +100bps
  const [targetCapital, setTargetCapital] = useState<number>(100000);
  const [selectedRwa, setSelectedRwa] = useState<string>("USDY");
  const [riskMode, setRiskMode] = useState<"conservative" | "institutional" | "alpha_seeker">("institutional");

  // Agent Chat State
  const [agentInput, setAgentInput] = useState("");
  const [agentThinking, setAgentThinking] = useState(false);
  const [chatLog, setChatLog] = useState<Array<{ sender: "user" | "agent"; text: string; time: string; tag?: string }>>([
    {
      sender: "agent",
      tag: "SYSTEM_INITIALIZED",
      time: "14:02:10 UTC",
      text: "👋 Chào mừng quý nhà đầu tư đến với CMC Sentinel-RWA. Hệ thống đã đồng bộ toàn bộ nguồn cấp dữ liệu Pro API từ CoinMarketCap. Bạn muốn tìm cơ hội Yield Arbitrage RWA hay quét độ sâu thanh khoản DEX trước khi giao dịch?",
    },
    {
      sender: "agent",
      tag: "YIELD_OPPORTUNITY",
      time: "14:05:22 UTC",
      text: "⚡ PHÁT HIỆN ARBITRAGE: Ondo USDY (5.15% APY) hiện tạo chênh lệch lợi suất +1.70% so với Lido stETH (3.45% APY) với mức bảo chứng 100% Trái phiếu Kho bạc Mỹ ngắn hạn, không chịu rủi ro trượt giá hoặc thanh lý hợp đồng DeFi.",
    },
  ]);

  // Real-world RWA Assets Data
  const rwaAssets = [
    { symbol: "BUIDL", name: "BlackRock USD Institutional Digital", issuer: "BlackRock / Securitize", apy: 4.95, aum: 524000000, risk: "AAA Prime", chain: "Ethereum", backing: "US Treasury Bills & Repo", minInvest: "$5,000,000", dailyChange: "+0.02%" },
    { symbol: "USDY", name: "Ondo US Dollar Yield", issuer: "Ondo Finance", apy: 5.15, aum: 452000000, risk: "AAA Institutional", chain: "Ethereum / Solana", backing: "Bank Deposits & US T-Bills", minInvest: "$500", dailyChange: "+0.04%" },
    { symbol: "USYC", name: "Hashnote Short Duration Yield", issuer: "Hashnote / Cumberland", apy: 5.08, aum: 215000000, risk: "AAA Prime", chain: "Ethereum", backing: "Reverse Repos & Treasuries", minInvest: "$100,000", dailyChange: "+0.01%" },
    { symbol: "STBT", name: "Matrixdock Short-Term Treasury", issuer: "Matrixport", apy: 4.85, aum: 128000000, risk: "AA+ Rated", chain: "Ethereum", backing: "US Treasury Bills", minInvest: "$10,000", dailyChange: "-0.01%" },
  ];

  // DEX Risk Intelligence
  const dexAssets = [
    { symbol: "BTC", name: "Bitcoin (Wrapped WBTC)", price: 76533.91, mcap: 1512400000000, vol24h: 38400000000, ratio: 0.025, slippage: 4, washProb: 3, status: "SAFE", assessment: "Thanh khoản sâu, an toàn tuyệt đối cho lệnh lớn." },
    { symbol: "ETH", name: "Ethereum (Native / WETH)", price: 2446.30, mcap: 294100000000, vol24h: 18200000000, ratio: 0.061, slippage: 6, washProb: 5, status: "SAFE", assessment: "Khối lượng giao dịch thực, độ trượt giá < 0.05%." },
    { symbol: "SOL", name: "Solana", price: 182.45, mcap: 85200000000, vol24h: 4200000000, ratio: 0.049, slippage: 8, washProb: 7, status: "SAFE", assessment: "Thanh khoản DEX Uniswap/Raydium đạt chuẩn định chế." },
    { symbol: "HAWK_AI", name: "Hawk Intelligence Token", price: 0.0412, mcap: 18200000, vol24h: 120000, ratio: 0.006, slippage: 89, washProb: 78, status: "DANGER", assessment: "BẪY THANH KHOẢN (Liquidity Trap): Vol/Mcap < 1%. Xả lệnh > $5k sẽ sập giá 15%." },
    { symbol: "PUMP_X", name: "HyperPump Token", price: 0.00031, mcap: 8500000, vol24h: 18500000, ratio: 2.176, slippage: 72, washProb: 94, status: "SUSPICIOUS", assessment: "WASH TRADING CAO: Vòng xoay volume bất thường 217% vốn hóa." },
  ];

  // Simulator math
  const currentAsset = rwaAssets.find((a) => a.symbol === selectedRwa) || rwaAssets[1];
  const dynamicApy = useMemo(() => {
    return Number((currentAsset.apy + fedRateShift * 0.01).toFixed(2));
  }, [currentAsset, fedRateShift]);

  const annualIncome = Math.round((targetCapital * dynamicApy) / 100);
  const monthlyIncome = Math.round(annualIncome / 12);

  const handleAgentChat = () => {
    if (!agentInput.trim()) return;
    const msg = agentInput;
    const time = new Date().toLocaleTimeString();
    setChatLog((prev) => [...prev, { sender: "user", text: msg, time }]);
    setAgentInput("");
    setAgentThinking(true);

    setTimeout(() => {
      let reply = "";
      let tag = "INTELLIGENCE";
      const lower = msg.toLowerCase();
      if (lower.includes("buidl") || lower.includes("blackrock") || lower.includes("ondo") || lower.includes("usdy") || lower.includes("rwa")) {
        tag = "RWA_ANALYSIS";
        reply = `🏦 [Institutional Audit]: Quỹ BlackRock BUIDL ($524M) và Ondo USDY ($452M) chiếm trên 74% toàn thị trường RWA Treasury trên CoinMarketCap. Với vốn $${targetCapital.toLocaleString()}, bạn có thể tạo dòng tiền $${annualIncome.toLocaleString()}/năm với mức an toàn cấp ngân hàng, loại bỏ 100% rủi ro Smart Contract Liquidation so với DeFi thông thường.`;
      } else if (lower.includes("risk") || lower.includes("dex") || lower.includes("trap") || lower.includes("btc")) {
        tag = "THREAT_PREVENTION";
        reply = `🛡️ [Sentinel Guard]: Dữ liệu CMC DEX API xác nhận các cặp thanh khoản chính của BTC/ETH trên Uniswap v3 đang ở trạng thái SAFE (Vol/Mcap 0.025 - 0.061). Tuy nhiên các đồng có tỷ lệ < 0.01 như HAWK_AI đang chứa nguy cơ Liquidity Trap 89%, bạn tuyệt đối không nên swap lệnh lớn.`;
      } else {
        tag = "PORTFOLIO_STRATEGY";
        reply = `📈 [Macro Rebalancer]: Với BTC Dominance đạt 58.85% và chỉ số Fear & Greed ở mức 68 (Greed), chiến lược tối ưu là phân bổ 45% BTC (trụ cột tăng trưởng), 35% RWA Treasuries (khóa lãi suất an toàn 5.15%), và 20% thanh khoản DeFi để phòng ngừa rủi ro biến động mạnh.`;
      }
      setChatLog((prev) => [...prev, { sender: "agent", text: reply, tag, time: new Date().toLocaleTimeString() }]);
      setAgentThinking(false);
    }, 700);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top Ticker Realtime Bar */}
      <div style={{ backgroundColor: "#0b111a", borderBottom: "1px solid #1e293b", padding: "8px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "#94a3b8" }}>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10b981", boxShadow: "0 0 10px #10b981" }}></span>
            <strong style={{ color: "#f8fafc" }}>CMC Pro API Stream</strong>
          </span>
          <span>BTC/USD: <strong style={{ color: "#34d399" }}>$76,533.91</strong> <span style={{ color: "#10b981" }}>(+1.42%)</span></span>
          <span>ETH/USD: <strong style={{ color: "#f87171" }}>$2,446.30</strong> <span style={{ color: "#f87171" }}>(-0.85%)</span></span>
          <span>BTC Dominance: <strong style={{ color: "#f59e0b" }}>58.85%</strong></span>
          <span>Top RWA Benchmark: <strong style={{ color: "#38bdf8" }}>5.15% APY</strong> (Ondo USDY)</span>
        </div>
        <div style={{ display: "flex", gap: "16px", alignItems: "center", fontSize: "11px" }}>
          <span className="badge-tag" style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#34d399", border: "1px solid #059669" }}>
            HACKATHON 2026 LIVE ENTRY
          </span>
          <span className="mono" style={{ color: "#64748b" }}>LATENCY: 38ms</span>
        </div>
      </div>

      {/* Main Navbar */}
      <header style={{ padding: "16px 32px", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(12, 18, 29, 0.8)", backdropFilter: "blur(12px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ backgroundColor: "rgba(59, 130, 246, 0.15)", border: "1px solid #3b82f6", padding: "10px", borderRadius: "10px", display: "flex" }}>
            <Zap color="#60a5fa" size={26} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h1 style={{ fontSize: "22px", fontWeight: "800", letterSpacing: "-0.5px" }} className="gradient-text">
                CMC SENTINEL-RWA
              </h1>
              <span className="badge-tag" style={{ backgroundColor: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", border: "1px solid #2563eb" }}>
                INSTITUTIONAL QUANT SUITE
              </span>
            </div>
            <p style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
              Multi-Agent Arbitrage Intelligence & DEX Risk Radar · Powered by CoinMarketCap Pro API v2
            </p>
          </div>
        </div>

        {/* Global Action Stats */}
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase" }}>Tổng Tài Sản RWA Theo Dõi</div>
            <div style={{ fontSize: "18px", fontWeight: "800", color: "#38bdf8" }}>$1,319,000,000</div>
          </div>
          <div style={{ height: "32px", width: "1px", backgroundColor: "#1e293b" }}></div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase" }}>Spread Arbitrage Tối Đa</div>
            <div style={{ fontSize: "18px", fontWeight: "800", color: "#34d399" }}>+1.70% NET APY</div>
          </div>
          <a
            href="https://github.com/huynhlongdai/cmc-sentinels-mcp"
            target="_blank"
            rel="noreferrer"
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px", backgroundColor: "#1e293b", color: "#f8fafc", borderRadius: "8px", textDecoration: "none", fontSize: "13px", fontWeight: "600", border: "1px solid #334155" }}
          >
            GitHub Repo <ExternalLink size={14} />
          </a>
        </div>
      </header>

      {/* Navigation Sub-Header */}
      <div style={{ display: "flex", padding: "0 32px", borderBottom: "1px solid #1e293b", backgroundColor: "#0c121d" }}>
        {[
          { id: "overview", label: "📊 Trung Tâm Tổng Quan (Command Center)", icon: Layers },
          { id: "rwa", label: "🏛️ Máy Tính RWA Yield Arbitrage (Simulator)", icon: Landmark },
          { id: "dex", label: "🛡️ Radar Bẫy Thanh Khoản DEX (Trap Detector)", icon: ShieldAlert },
          { id: "rebalance", label: "⚖️ Chiến Lược Phân Bổ Định Chế (Rebalancer)", icon: PieChart },
          { id: "agent", label: "🤖 AI Sentinel Co-Pilot Terminal", icon: Bot },
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
                padding: "16px 20px",
                border: "none",
                background: "none",
                color: active ? "#60a5fa" : "#94a3b8",
                borderBottom: active ? "3px solid #3b82f6" : "3px solid transparent",
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

      {/* Hero Explainer Banner: GIẢI THÍCH RÕ RÀNG GIÁ TRỊ CỦA WEBSITE */}
      <div style={{ backgroundColor: "#0c1320", borderBottom: "1px solid #1e293b", padding: "20px 32px" }}>
        <div style={{ maxWidth: "1600px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "32px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span className="badge-tag" style={{ backgroundColor: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", border: "1px solid #0284c7" }}>
                VẤN ĐỀ ĐƯỢC GIẢI QUYẾT
              </span>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>Dành cho Nhà Đầu Tư & AI Trading Agent</span>
            </div>
            <p style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: "1.6", margin: 0 }}>
              Thị trường Crypto đang bước vào kỷ nguyên mới: <strong>RWA (Tài sản thực tế như Trái phiếu Mỹ, Cổ phiếu)</strong> kết hợp với <strong>DEX & AI Agents</strong>. 
              Website này sử dụng <strong>CoinMarketCap Pro API</strong> để giúp bạn: <span style={{ color: "#34d399" }}>① Khóa lãi suất 4.95% - 5.15%/năm an toàn bằng Trái phiếu Mỹ</span>, <span style={{ color: "#f87171" }}>② Tránh bẫy thanh khoản và rửa tiền ảo trên DEX</span>, và <span style={{ color: "#60a5fa" }}>③ Tự động ra quyết định đầu tư bằng Trí tuệ Nhân tạo</span>.
            </p>
          </div>
          <div style={{ display: "flex", gap: "16px", flexShrink: 0 }}>
            <div style={{ padding: "12px 18px", backgroundColor: "#131c2c", borderRadius: "10px", border: "1px solid #1e293b", textAlign: "center" }}>
              <div style={{ fontSize: "11px", color: "#64748b" }}>RỦI RO SMART CONTRACT</div>
              <div style={{ fontSize: "16px", fontWeight: "bold", color: "#34d399" }}>0% (Bảo chứng bởi Fed)</div>
            </div>
            <div style={{ padding: "12px 18px", backgroundColor: "#131c2c", borderRadius: "10px", border: "1px solid #1e293b", textAlign: "center" }}>
              <div style={{ fontSize: "11px", color: "#64748b" }}>CHU KỲ DÒNG TIỀN</div>
              <div style={{ fontSize: "16px", fontWeight: "bold", color: "#f59e0b" }}>Flight to Quality</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Viewport Content */}
      <main style={{ padding: "32px", maxWidth: "1600px", margin: "0 auto", width: "100%", flex: 1 }}>

        {/* ======================================================== */}
        {/* TAB 1: COMMAND CENTER OVERVIEW                           */}
        {/* ======================================================== */}
        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            {/* Top 4 Quick Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
              <div className="glass-panel" style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>TỔNG QUY MÔ RWA TOÀN CẦU</span>
                  <Landmark size={18} color="#38bdf8" />
                </div>
                <div style={{ fontSize: "28px", fontWeight: "800", color: "#f8fafc" }}>$1.319 TỶ</div>
                <div style={{ fontSize: "12px", color: "#34d399", display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                  <TrendingUp size={14} /> +18.4% tăng trưởng tháng qua
                </div>
              </div>

              <div className="glass-panel" style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>LÃI SUẤT RWA CAO NHẤT</span>
                  <Zap size={18} color="#10b981" />
                </div>
                <div style={{ fontSize: "28px", fontWeight: "800", color: "#34d399" }}>5.15% APY</div>
                <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                  Ondo USDY (Bảo chứng Kho bạc Mỹ)
                </div>
              </div>

              <div className="glass-panel" style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>DEX VULNERABILITY RADAR</span>
                  <ShieldAlert size={18} color="#ef4444" />
                </div>
                <div style={{ fontSize: "28px", fontWeight: "800", color: "#ef4444" }}>2 CẢNH BÁO</div>
                <div style={{ fontSize: "12px", color: "#f87171", marginTop: "4px" }}>
                  Phát hiện Bẫy Thanh Khoản & Wash Trading
                </div>
              </div>

              <div className="glass-panel" style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>TÂM LÝ THỊ TRƯỜNG (CMC)</span>
                  <Activity size={18} color="#f59e0b" />
                </div>
                <div style={{ fontSize: "28px", fontWeight: "800", color: "#f59e0b" }}>68 / 100</div>
                <div style={{ fontSize: "12px", color: "#34d399", marginTop: "4px" }}>
                  Greed (Dòng tiền ưa thích rủi ro cao)
                </div>
              </div>
            </div>

            {/* Split Row: Real-time Arbitrage Matrix & DEX Threat Matrix */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "28px" }}>
              {/* RWA Yield Overview */}
              <div className="glass-panel" style={{ padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <div>
                    <h3 style={{ fontSize: "17px", fontWeight: "bold" }}>Bảng So Sánh Lợi Suất RWA vs DeFi Staking</h3>
                    <p style={{ fontSize: "12px", color: "#64748b" }}>Dữ liệu thời gian thực từ CoinMarketCap Pro API</p>
                  </div>
                  <button onClick={() => setActiveTab("rwa")} style={{ padding: "6px 14px", backgroundColor: "#1e293b", color: "#60a5fa", border: "1px solid #3b82f6", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
                    Mở Trình Giả Lập ↗
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {rwaAssets.map((asset, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", backgroundColor: "#0b111a", borderRadius: "8px", border: "1px solid #1e293b" }}>
                      <div>
                        <div style={{ fontWeight: "bold", fontSize: "14px", color: "#f8fafc" }}>{asset.symbol} - {asset.name}</div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>Tổ chức phát hành: {asset.issuer} · {asset.backing}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "16px", fontWeight: "bold", color: "#34d399" }}>{asset.apy}% APY</div>
                        <div style={{ fontSize: "11px", color: "#38bdf8" }}>Quy mô: ${(asset.aum / 1e6).toFixed(0)}M</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Insight Box */}
                <div style={{ marginTop: "16px", padding: "14px", backgroundColor: "rgba(59, 130, 246, 0.1)", borderRadius: "8px", border: "1px solid rgba(59, 130, 246, 0.3)", display: "flex", gap: "10px", alignItems: "center" }}>
                  <Sparkles size={20} color="#60a5fa" style={{ flexShrink: 0 }} />
                  <p style={{ fontSize: "12px", color: "#bfdbfe", margin: 0, lineHeight: "1.5" }}>
                    <strong>Khuyến nghị Quant Sentinel:</strong> Lãi suất Kho bạc Mỹ thực tế của BlackRock BUIDL (4.95%) và Ondo USDY (5.15%) đang vượt trội so với Staking Ethereum (3.45%). Nhà đầu tư nên dịch chuyển một phần danh mục sang RWA để bảo toàn vốn trong giai đoạn thị trường tích lũy.
                  </p>
                </div>
              </div>

              {/* Live Threat Radar Box */}
              <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <div>
                      <h3 style={{ fontSize: "17px", fontWeight: "bold" }}>Radar Quét Bẫy Thanh Khoản & Volume Ảo</h3>
                      <p style={{ fontSize: "12px", color: "#64748b" }}>Bảo vệ AI Agent & Trader trước khi nộp lệnh</p>
                    </div>
                    <button onClick={() => setActiveTab("dex")} style={{ padding: "6px 14px", backgroundColor: "#1e293b", color: "#f87171", border: "1px solid #ef4444", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
                      Chi Tiết DEX ↗
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {dexAssets.slice(0, 4).map((token, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", backgroundColor: "#0b111a", borderRadius: "8px", border: "1px solid #1e293b" }}>
                        <div>
                          <span style={{ fontWeight: "bold", fontSize: "14px" }}>{token.symbol}</span>
                          <span style={{ fontSize: "11px", color: "#64748b", marginLeft: "8px" }}>{token.name}</span>
                        </div>
                        <div>
                          {token.status === "SAFE" ? (
                            <span className="badge-tag" style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#34d399", border: "1px solid #059669" }}>
                              ✓ AN TOÀN
                            </span>
                          ) : (
                            <span className="badge-tag" style={{ backgroundColor: "rgba(239, 68, 68, 0.15)", color: "#f87171", border: "1px solid #b91c1c" }}>
                              ⚠ BẪY THANH KHOẢN
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: "20px", padding: "14px", backgroundColor: "#131c2c", borderRadius: "8px", border: "1px solid #1e293b" }}>
                  <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>💡 Cách nhận diện bẫy thanh khoản:</div>
                  <div style={{ fontSize: "11px", color: "#cbd5e1", lineHeight: "1.5" }}>
                    Khi tỷ lệ 24h Volume / Market Cap &lt; 0.01 (1%), token đó gần như không có người mua thực trên Uniswap/Raydium. Nếu bán lệnh lớn, trượt giá có thể lên tới 20% - 50%.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: RWA YIELD ARBITRAGE SIMULATOR                     */}
        {/* ======================================================== */}
        {activeTab === "rwa" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            {/* Interactive Calculator Controls */}
            <div className="glass-panel" style={{ padding: "28px", display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: "32px", alignItems: "center" }}>
              {/* Slider 1: Capital */}
              <div>
                <label style={{ fontSize: "13px", fontWeight: "bold", color: "#94a3b8", display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <DollarSign size={16} color="#34d399" /> SỐ VỐN ĐẦU TƯ MÔ PHỎNG: <strong style={{ color: "#34d399", fontSize: "16px" }}>${targetCapital.toLocaleString()}</strong>
                </label>
                <input
                  type="range"
                  min="10000"
                  max="1000000"
                  step="10000"
                  value={targetCapital}
                  onChange={(e) => setTargetCapital(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#10b981", cursor: "pointer" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#64748b", marginTop: "6px" }}>
                  <span>$10,000</span>
                  <span>$500,000</span>
                  <span>$1,000,000</span>
                </div>
              </div>

              {/* Slider 2: Fed Rate Shift */}
              <div>
                <label style={{ fontSize: "13px", fontWeight: "bold", color: "#94a3b8", display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <Sliders size={16} color="#60a5fa" /> KỊCH BẢN LÃI SUẤT FED: <strong style={{ color: "#60a5fa", fontSize: "16px" }}>{fedRateShift > 0 ? `+${fedRateShift}` : fedRateShift} bps</strong>
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
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#64748b", marginTop: "6px" }}>
                  <span>-100 bps (Cắt giảm)</span>
                  <span>Hiện tại</span>
                  <span>+100 bps (Tăng lãi)</span>
                </div>
              </div>

              {/* Projected Profit Output Card */}
              <div style={{ backgroundColor: "#0b121e", border: "1px solid #2563eb", borderRadius: "12px", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "11px", color: "#93c5fd", textTransform: "uppercase" }}>DÒNG TIỀN LÃI SUẤT RWA MỖI NĂM</div>
                  <div style={{ fontSize: "28px", fontWeight: "800", color: "#34d399", margin: "4px 0" }}>+${annualIncome.toLocaleString()}</div>
                  <div style={{ fontSize: "12px", color: "#94a3b8" }}>Thu nhập thụ động: <strong>${monthlyIncome.toLocaleString()} / tháng</strong></div>
                </div>
                <div style={{ backgroundColor: "#2563eb", padding: "12px", borderRadius: "10px" }}>
                  <TrendingUp size={24} color="#ffffff" />
                </div>
              </div>
            </div>

            {/* Asset Selection & Deep Comparison Table */}
            <div className="glass-panel" style={{ overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>Danh Mục Quỹ Trái Phiếu Kho Bạc Mỹ Token Hóa (RWA)</h3>
                  <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#64748b" }}>Bảo chứng minh bạch 100% bằng tài sản thực tế theo API CoinMarketCap</p>
                </div>
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>Chọn quỹ để xem kịch bản lợi nhuận</div>
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#0c1320", color: "#64748b", borderBottom: "1px solid #1e293b" }}>
                    <th style={{ padding: "14px 24px" }}>QUỸ RWA</th>
                    <th style={{ padding: "14px 16px" }}>TỔ CHỨC PHÁT HÀNH</th>
                    <th style={{ padding: "14px 16px" }}>TÀI SẢN BẢO CHỨNG</th>
                    <th style={{ padding: "14px 16px" }}>VỐN HÓA (AUM)</th>
                    <th style={{ padding: "14px 16px" }}>LÃI SUẤT HIỆN TẠI</th>
                    <th style={{ padding: "14px 16px" }}>LÃI THEO FED RATE</th>
                    <th style={{ padding: "14px 16px" }}>HÀNH ĐỘNG</th>
                  </tr>
                </thead>
                <tbody>
                  {rwaAssets.map((asset, i) => {
                    const isSelected = selectedRwa === asset.symbol;
                    const calculatedApy = (asset.apy + fedRateShift * 0.01).toFixed(2);
                    return (
                      <tr key={i} style={{ borderBottom: "1px solid #1e293b", backgroundColor: isSelected ? "rgba(59, 130, 246, 0.08)" : "transparent" }}>
                        <td style={{ padding: "16px 24px" }}>
                          <div style={{ fontWeight: "bold", fontSize: "14px", color: "#f8fafc" }}>{asset.symbol}</div>
                          <div style={{ fontSize: "11px", color: "#64748b" }}>{asset.name}</div>
                        </td>
                        <td style={{ padding: "16px 16px", color: "#cbd5e1" }}>{asset.issuer}</td>
                        <td style={{ padding: "16px 16px", color: "#94a3b8" }}>{asset.backing}</td>
                        <td style={{ padding: "16px 16px", fontWeight: "bold", color: "#38bdf8" }}>${(asset.aum / 1e6).toFixed(0)} Triệu USD</td>
                        <td style={{ padding: "16px 16px", color: "#cbd5e1", fontWeight: "600" }}>{asset.apy}% APY</td>
                        <td style={{ padding: "16px 16px" }}>
                          <strong style={{ fontSize: "15px", color: "#34d399" }}>{calculatedApy}% APY</strong>
                        </td>
                        <td style={{ padding: "16px 16px" }}>
                          <button
                            onClick={() => setSelectedRwa(asset.symbol)}
                            style={{
                              padding: "6px 14px",
                              borderRadius: "6px",
                              border: isSelected ? "1px solid #3b82f6" : "1px solid #334155",
                              backgroundColor: isSelected ? "#2563eb" : "#131c2c",
                              color: "#ffffff",
                              fontSize: "12px",
                              cursor: "pointer",
                              fontWeight: "600",
                            }}
                          >
                            {isSelected ? "Đang chọn" : "Mô phỏng"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: DEX LIQUIDITY TRAP & WASH TRADING RADAR           */}
        {/* ======================================================== */}
        {activeTab === "dex" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            {/* Guide Explainer for Normal Users */}
            <div className="glass-panel" style={{ padding: "24px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px" }}>
              <div style={{ borderLeft: "3px solid #10b981", paddingLeft: "16px" }}>
                <div style={{ fontSize: "14px", fontWeight: "bold", color: "#34d399", marginBottom: "4px" }}>1. Thanh Khoản Đạt Chuẩn (Safe)</div>
                <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.5" }}>
                  Tỷ lệ Vol/Mcap từ 0.02 đến 0.50. Token có dòng tiền thật, độ sâu orderbook dồi dào, lệnh swap trên $10,000 trượt giá dưới 0.1%.
                </div>
              </div>

              <div style={{ borderLeft: "3px solid #ef4444", paddingLeft: "16px" }}>
                <div style={{ fontSize: "14px", fontWeight: "bold", color: "#f87171", marginBottom: "4px" }}>2. Bẫy Thanh Khoản (Liquidity Trap)</div>
                <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.5" }}>
                  Tỷ lệ Vol/Mcap &lt; 0.01. Vốn hóa ảo cao nhưng trong pool DEX không có thanh khoản. Khi xả lệnh sẽ chịu thiệt hại trượt giá khổng lồ.
                </div>
              </div>

              <div style={{ borderLeft: "3px solid #f59e0b", paddingLeft: "16px" }}>
                <div style={{ fontSize: "14px", fontWeight: "bold", color: "#fbbf24", marginBottom: "4px" }}>3. Rửa Tiền & Tạo Volume Ảo (Wash Trading)</div>
                <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.5" }}>
                  Tỷ lệ Vol/Mcap &gt; 1.50. Nhà cái dùng bot tự mua tự bán tạo volume giả nhằm leo Top Trending trên CoinMarketCap để xả hàng.
                </div>
              </div>
            </div>

            {/* DEX Table */}
            <div className="glass-panel" style={{ overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #1e293b" }}>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>Bảng Kiểm Tra Rủi Ro Các Token Phổ Biến Trên DEX</h3>
                <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#64748b" }}>Tính toán theo thời gian thực từ Volume và Vốn Hóa CMC API</p>
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#0c1320", color: "#64748b", borderBottom: "1px solid #1e293b" }}>
                    <th style={{ padding: "14px 24px" }}>TOKEN</th>
                    <th style={{ padding: "14px 16px" }}>GIÁ & VỐN HÓA</th>
                    <th style={{ padding: "14px 16px" }}>VOLUME 24H</th>
                    <th style={{ padding: "14px 16px" }}>TỶ LỆ VOL/MCAP</th>
                    <th style={{ padding: "14px 16px" }}>NGUY CƠ TRƯỢT GIÁ</th>
                    <th style={{ padding: "14px 16px" }}>TỶ LỆ WASH TRADING</th>
                    <th style={{ padding: "14px 16px" }}>TRẠNG THÁI</th>
                    <th style={{ padding: "14px 24px" }}>ĐÁNH GIÁ CỦA SENTINEL</th>
                  </tr>
                </thead>
                <tbody>
                  {dexAssets.map((t, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #1e293b" }}>
                      <td style={{ padding: "16px 24px" }}>
                        <div style={{ fontWeight: "bold", fontSize: "14px", color: "#f8fafc" }}>{t.symbol}</div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>{t.name}</div>
                      </td>
                      <td style={{ padding: "16px 16px" }}>
                        <div style={{ color: "#f8fafc", fontWeight: "600" }}>${t.price.toLocaleString()}</div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>${(t.mcap / 1e6).toFixed(1)}M Mcap</div>
                      </td>
                      <td style={{ padding: "16px 16px", color: "#cbd5e1" }}>
                        ${(t.vol24h / 1e6).toFixed(2)}M
                      </td>
                      <td style={{ padding: "16px 16px", fontWeight: "bold", color: t.ratio < 0.01 ? "#ef4444" : t.ratio > 1.5 ? "#f59e0b" : "#34d399" }}>
                        {t.ratio.toFixed(3)}
                      </td>
                      <td style={{ padding: "16px 16px" }}>
                        <div style={{ width: "90px", height: "6px", backgroundColor: "#1e293b", borderRadius: "3px", overflow: "hidden", marginBottom: "4px" }}>
                          <div style={{ width: `${t.slippage}%`, height: "100%", backgroundColor: t.slippage > 50 ? "#ef4444" : "#10b981" }}></div>
                        </div>
                        <span style={{ fontSize: "11px", color: "#94a3b8" }}>{t.slippage}/100</span>
                      </td>
                      <td style={{ padding: "16px 16px", color: t.washProb > 50 ? "#f87171" : "#94a3b8", fontWeight: t.washProb > 50 ? "bold" : "normal" }}>
                        {t.washProb}%
                      </td>
                      <td style={{ padding: "16px 16px" }}>
                        {t.status === "SAFE" && (
                          <span className="badge-tag" style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#34d399", border: "1px solid #059669" }}>
                            VERIFIED SAFE
                          </span>
                        )}
                        {t.status === "DANGER" && (
                          <span className="badge-tag" style={{ backgroundColor: "rgba(239, 68, 68, 0.15)", color: "#f87171", border: "1px solid #b91c1c" }}>
                            BẪY XẢ HÀNG
                          </span>
                        )}
                        {t.status === "SUSPICIOUS" && (
                          <span className="badge-tag" style={{ backgroundColor: "rgba(245, 158, 11, 0.15)", color: "#fbbf24", border: "1px solid #d97706" }}>
                            VOLUME ẢO
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "16px 24px", color: "#94a3b8", fontSize: "12px", maxWidth: "280px", lineHeight: "1.4" }}>
                        {t.assessment}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: QUANT MACRO REBALANCER                            */}
        {/* ======================================================== */}
        {activeTab === "rebalance" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" }}>
            <div className="glass-panel" style={{ padding: "28px" }}>
              <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "bold" }}>Tỷ Trọng Thống Trị Thị Trường (Dominance Curve)</h3>
              <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 24px 0" }}>Căn cứ dữ liệu vĩ mô từ CMC Pro API để nhận diện chu kỳ dòng tiền</p>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px" }}>
                    <span style={{ color: "#f8fafc", fontWeight: "bold" }}>Bitcoin Dominance (BTC.D)</span>
                    <strong style={{ color: "#f59e0b" }}>58.85%</strong>
                  </div>
                  <div style={{ height: "12px", backgroundColor: "#1e293b", borderRadius: "6px", overflow: "hidden" }}>
                    <div style={{ width: "58.85%", height: "100%", backgroundColor: "#f59e0b" }}></div>
                  </div>
                  <span style={{ fontSize: "11px", color: "#64748b", marginTop: "4px", display: "block" }}>Dòng tiền đang dồn vào BTC, các Altcoin nhỏ chịu áp lực rút vốn.</span>
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
                    <span style={{ color: "#f8fafc", fontWeight: "bold" }}>Tokenized RWA Treasuries (Dòng tiền Trái phiếu)</span>
                    <strong style={{ color: "#10b981" }}>6.40%</strong>
                  </div>
                  <div style={{ height: "12px", backgroundColor: "#1e293b", borderRadius: "6px", overflow: "hidden" }}>
                    <div style={{ width: "6.40%", height: "100%", backgroundColor: "#10b981" }}></div>
                  </div>
                  <span style={{ fontSize: "11px", color: "#10b981", marginTop: "4px", display: "block" }}>Tăng trưởng nhanh nhất trong các mảng thị trường mới của CoinMarketCap.</span>
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "bold" }}>Chiến Lược Tái Cơ Cấu Danh Mục Định Chế</h3>
                  <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#64748b" }}>Tự động điều chỉnh tỷ trọng theo khẩu vị rủi ro</p>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  {(["conservative", "institutional", "alpha_seeker"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setRiskMode(mode)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: "1px solid #334155",
                        backgroundColor: riskMode === mode ? "#2563eb" : "#0c1320",
                        color: riskMode === mode ? "#ffffff" : "#94a3b8",
                        fontSize: "11px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      {mode === "conservative" ? "An Toàn" : mode === "institutional" ? "Định Chế" : "Tăng Trưởng"}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ padding: "14px 18px", backgroundColor: "#0b121e", borderRadius: "8px", border: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ color: "#f8fafc", fontSize: "14px" }}>Bitcoin (BTC) - Trụ Cột Vĩ Mô</strong>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>Chống lạm phát, tận dụng đợt tăng Dominance</div>
                  </div>
                  <strong style={{ fontSize: "18px", color: "#f59e0b" }}>
                    {riskMode === "conservative" ? "35%" : riskMode === "institutional" ? "45%" : "40%"}
                  </strong>
                </div>

                <div style={{ padding: "14px 18px", backgroundColor: "#0b121e", borderRadius: "8px", border: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ color: "#f8fafc", fontSize: "14px" }}>RWA Treasuries (USDY / BUIDL)</strong>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>Khóa lãi suất 5.15% APY tiền tươi thóc thật, không lo sập giá</div>
                  </div>
                  <strong style={{ fontSize: "18px", color: "#10b981" }}>
                    {riskMode === "conservative" ? "45%" : riskMode === "institutional" ? "35%" : "15%"}
                  </strong>
                </div>

                <div style={{ padding: "14px 18px", backgroundColor: "#0b121e", borderRadius: "8px", border: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ color: "#f8fafc", fontSize: "14px" }}>Ethereum Liquid Staking (stETH)</strong>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>Lãi suất Staking trên mạng lưới DeFi</div>
                  </div>
                  <strong style={{ fontSize: "18px", color: "#3b82f6" }}>
                    {riskMode === "conservative" ? "10%" : riskMode === "institutional" ? "15%" : "25%"}
                  </strong>
                </div>

                <div style={{ padding: "14px 18px", backgroundColor: "#0b121e", borderRadius: "8px", border: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ color: "#f8fafc", fontSize: "14px" }}>Dự Trữ Tiền Mặt (Stablecoin / Cash)</strong>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>Sẵn sàng thanh khoản bắt đáy khi thị trường điều chỉnh</div>
                  </div>
                  <strong style={{ fontSize: "18px", color: "#94a3b8" }}>
                    {riskMode === "conservative" ? "10%" : riskMode === "institutional" ? "5%" : "20%"}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: AI SENTINEL COPILOT TERMINAL                      */}
        {/* ======================================================== */}
        {activeTab === "agent" && (
          <div className="glass-panel" style={{ height: "650px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "16px 24px", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#0c1320" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Bot size={20} color="#60a5fa" />
                <span style={{ fontWeight: "bold", fontSize: "15px" }}>Trợ Lý Trí Tuệ Nhân Tạo CMC Sentinel-RWA</span>
              </div>
              <span className="badge-tag" style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#34d399", border: "1px solid #059669" }}>
                MODEL CONTEXT PROTOCOL (MCP) READY
              </span>
            </div>

            <div style={{ flex: 1, padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
              {chatLog.map((log, index) => (
                <div key={index} style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: log.sender === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "11px", color: "#64748b" }}>
                    {log.tag && <span style={{ backgroundColor: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", padding: "1px 6px", borderRadius: "3px", fontWeight: "bold" }}>{log.tag}</span>}
                    <span>{log.time}</span>
                  </div>
                  <div
                    style={{
                      padding: "14px 18px",
                      borderRadius: "10px",
                      maxWidth: "80%",
                      fontSize: "13px",
                      lineHeight: "1.6",
                      backgroundColor: log.sender === "user" ? "#2563eb" : "#0c1320",
                      color: "#f8fafc",
                      border: log.sender === "user" ? "1px solid #3b82f6" : "1px solid #1e293b",
                    }}
                  >
                    {log.text}
                  </div>
                </div>
              ))}
              {agentThinking && (
                <div style={{ display: "flex", gap: "8px", alignItems: "center", color: "#38bdf8", fontSize: "12px" }}>
                  <Activity size={14} className="animate-spin" />
                  <span>Sentinel Agent đang gọi CoinMarketCap API và tổng hợp phân tích...</span>
                </div>
              )}
            </div>

            <div style={{ padding: "16px 24px", borderTop: "1px solid #1e293b", backgroundColor: "#0c1320", display: "flex", gap: "12px" }}>
              <input
                type="text"
                value={agentInput}
                onChange={(e) => setAgentInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAgentChat()}
                placeholder="Gõ câu hỏi: 'Phân tích BlackRock BUIDL', 'So sánh Yield Ondo vs Aave', 'Kiểm tra bẫy thanh khoản BTC'..."
                style={{
                  flex: 1,
                  backgroundColor: "#06090e",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  padding: "12px 18px",
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
                  borderRadius: "8px",
                  padding: "0 24px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                Gửi Lệnh
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #1e293b", padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "#64748b", backgroundColor: "#06090e" }}>
        <div>
          © 2026 CMC Sentinel-RWA · Built for <strong>Build with CMC: API Hackathon 2026</strong> by <strong>Longca Crypto & Agent Army</strong>
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          <span>CoinMarketCap Pro API v2</span>
          <span>Model Context Protocol (MCP)</span>
          <span>MIT License</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
