import { useState } from "react";
import {
  Zap,
  Landmark,
  ShieldAlert,
  Bot,
  ExternalLink,
  Layers
} from "lucide-react";

export function App() {
  const [activeTab, setActiveTab] = useState<"overview" | "rwa" | "dex" | "agent">("overview");
  const [fedShift] = useState<number>(0);
  const [capital, setCapital] = useState<number>(50000);
  const [selectedAsset, setSelectedAsset] = useState<string>("USDY");

  // Chat copilot state
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "bot" | "user"; text: string; time: string }>>([
    {
      sender: "bot",
      time: "14:20",
      text: "Xin chào Anh Longca! Em là CMC Sentinel AI. Em đang theo dõi realtime dữ liệu từ CoinMarketCap Pro API. Em có thể tính toán dòng tiền RWA hoặc quét bẫy trượt giá DEX cho anh ngay bây giờ.",
    },
  ]);

  // RWA Yield Benchmark
  const rwaList = [
    { symbol: "BUIDL", name: "BlackRock USD Institutional", issuer: "BlackRock", apy: 4.95, aum: "$524M", risk: "AAA Prime", color: "#3b82f6" },
    { symbol: "USDY", name: "Ondo US Dollar Yield", issuer: "Ondo Finance", apy: 5.15, aum: "$452M", risk: "Institutional", color: "#10b981" },
    { symbol: "USYC", name: "Hashnote Short Duration", issuer: "Hashnote", apy: 5.08, aum: "$215M", risk: "AAA Rated", color: "#8b5cf6" },
    { symbol: "STBT", name: "Matrixdock Treasury T-Bills", issuer: "Matrixport", apy: 4.85, aum: "$128M", risk: "AA+ Tier", color: "#f59e0b" },
  ];

  // DEX Risk Matrix
  const dexTokens = [
    { symbol: "BTC", name: "Wrapped Bitcoin", price: "$76,533.91", change: "+1.42%", vol: "$38.4B", ratio: "0.025", status: "SAFE", color: "#10b981" },
    { symbol: "ETH", name: "Ethereum", price: "$2,446.30", change: "-0.85%", vol: "$18.2B", ratio: "0.061", status: "SAFE", color: "#10b981" },
    { symbol: "SOL", name: "Solana", price: "$182.45", change: "+4.12%", vol: "$4.2B", ratio: "0.049", status: "SAFE", color: "#10b981" },
    { symbol: "HAWK_AI", name: "Hawk Intelligence", price: "$0.0412", change: "+45.2%", vol: "$120K", ratio: "0.006", status: "TRAP", color: "#ef4444" },
  ];

  const currentRwa = rwaList.find((r) => r.symbol === selectedAsset) || rwaList[1];
  const dynamicApy = Number((currentRwa.apy + fedShift * 0.01).toFixed(2));
  const annualCashflow = Math.round((capital * dynamicApy) / 100);
  const monthlyCashflow = Math.round(annualCashflow / 12);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const q = chatInput;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setChatMessages((prev) => [...prev, { sender: "user", text: q, time }]);
    setChatInput("");

    setTimeout(() => {
      let reply = "";
      if (q.toLowerCase().includes("rwa") || q.toLowerCase().includes("buidl") || q.toLowerCase().includes("usdy")) {
        reply = `🏦 [CMC RWA Feed]: Quỹ Ondo USDY & BlackRock BUIDL đang có lợi suất ${(currentRwa.apy + fedShift * 0.01).toFixed(2)}% APY. Với vốn $${capital.toLocaleString()}, bạn nhận về $${monthlyCashflow.toLocaleString()}/tháng an toàn 100% bảo chứng Kho bạc Mỹ, miễn nhiễm hoàn toàn với rủi ro thanh lý DeFi.`;
      } else if (q.toLowerCase().includes("dex") || q.toLowerCase().includes("trap") || q.toLowerCase().includes("risk")) {
        reply = `🛡️ [Sentinel DEX Radar]: Cảnh báo token HAWK_AI có tỷ lệ Vol/Mcap = 0.006 (< 1%), đây là bẫy thanh khoản kinh điển (Liquidity Trap). Nếu swap lệnh > $3,000 trên Uniswap v2, bạn sẽ chịu mức trượt giá trên 12%.`;
      } else {
        reply = `📈 [Macro Copilot]: Thị trường đang ở trạng thái Greed (68/100) với BTC Dominance 58.85%. Chiến lược tối ưu hiện tại: Phân bổ 45% BTC, 35% RWA Treasuries và 20% DeFi Staking để tối đa hóa dòng tiền thụ động.`;
      }
      setChatMessages((prev) => [...prev, { sender: "bot", text: reply, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    }, 600);
  };

  return (
    <div style={{ backgroundColor: "#edf2f9", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", color: "#1e293b", padding: "24px" }}>
      {/* Outer Modern Framed Card (như ảnh Dribbble) */}
      <div
        style={{
          maxWidth: "1480px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderRadius: "28px",
          boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top Navbar */}
        <header style={{ padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9" }}>
          {/* Logo & Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ backgroundColor: "#2563eb", width: "42px", height: "42px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 16px rgba(37, 99, 235, 0.25)" }}>
              <Zap color="#ffffff" size={22} />
            </div>
            <div>
              <div style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.3px", display: "flex", alignItems: "center", gap: "8px" }}>
                CMC Sentinel-RWA
                <span style={{ backgroundColor: "#e0f2fe", color: "#0369a1", fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "8px" }}>v2.4 Pro</span>
              </div>
              <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>Autonomous RWA Arbitrage & DEX Liquidity Guard</p>
            </div>
          </div>

          {/* Navigation Pills (như thanh tab Woka Dashboard) */}
          <div style={{ display: "flex", backgroundColor: "#f1f5f9", padding: "4px", borderRadius: "16px", gap: "4px" }}>
            {[
              { id: "overview", label: "Dashboard", icon: Layers },
              { id: "rwa", label: "RWA Simulator", icon: Landmark },
              { id: "dex", label: "DEX Radar", icon: ShieldAlert },
              { id: "agent", label: "AI Copilot", icon: Bot },
            ].map((tab) => {
              const Icon = tab.icon;
              const isAct = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 18px",
                    borderRadius: "12px",
                    border: "none",
                    backgroundColor: isAct ? "#2563eb" : "transparent",
                    color: isAct ? "#ffffff" : "#64748b",
                    fontWeight: isAct ? "700" : "600",
                    fontSize: "13px",
                    cursor: "pointer",
                    boxShadow: isAct ? "0 4px 12px rgba(37, 99, 235, 0.2)" : "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Right Profile & Badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#ecfdf5", padding: "6px 14px", borderRadius: "20px", border: "1px solid #a7f3d0" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10b981", boxShadow: "0 0 8px #10b981" }}></span>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#065f46" }}>CMC Pro API Live</span>
            </div>
            <a
              href="https://github.com/huynhlongdai/cmc-sentinels-mcp"
              target="_blank"
              rel="noreferrer"
              style={{
                backgroundColor: "#0f172a",
                color: "#ffffff",
                padding: "8px 16px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "700",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              GitHub <ExternalLink size={12} />
            </a>
          </div>
        </header>

        {/* Dashboard Title & Quick Summary Bar */}
        <div style={{ padding: "24px 32px 0 32px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Institutional Market Suite</span>
            <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", marginTop: "2px" }}>Real World Assets & Risk Dashboard</h2>
          </div>
          <div style={{ display: "flex", gap: "24px", fontSize: "13px" }}>
            <div>
              <span style={{ color: "#64748b" }}>BTC Dominance:</span> <strong style={{ color: "#0f172a" }}>58.85%</strong>
            </div>
            <div>
              <span style={{ color: "#64748b" }}>Market Sentiment:</span> <strong style={{ color: "#10b981" }}>68 (Greed)</strong>
            </div>
            <div>
              <span style={{ color: "#64748b" }}>Tracked RWA AUM:</span> <strong style={{ color: "#2563eb" }}>$1.319B</strong>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MAIN DASHBOARD GRID (Phong cách Card Modular Dribbble)    */}
        {/* ========================================================= */}
        <div style={{ padding: "24px 32px 32px 32px", display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px" }}>
          
          {/* LEFT 3-COLUMN MODULAR TILES */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* ROW 1: 3 METRIC TILES */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1.2fr", gap: "20px" }}>
              
              {/* Tile 1: RWA Yield Leader (Donut Style Visual) */}
              <div style={{ backgroundColor: "#f8fafc", borderRadius: "22px", padding: "22px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "#64748b" }}>TOP YIELD RWA</span>
                    <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: "2px 0 0 0" }}>Ondo USDY</h3>
                  </div>
                  <span style={{ backgroundColor: "#ecfdf5", color: "#059669", fontSize: "11px", fontWeight: "800", padding: "3px 8px", borderRadius: "8px" }}>+1.70% Spread</span>
                </div>

                {/* Circular Donut Graphic */}
                <div style={{ margin: "20px auto", position: "relative", width: "120px", height: "120px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray="314" strokeDashoffset="70" strokeLinecap="round" transform="rotate(-90 60 60)" />
                  </svg>
                  <div style={{ position: "absolute", textAlign: "center" }}>
                    <div style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a" }}>5.15%</div>
                    <div style={{ fontSize: "10px", color: "#64748b", fontWeight: "700" }}>NET APY</div>
                  </div>
                </div>

                <div style={{ fontSize: "12px", color: "#64748b", textAlign: "center" }}>
                  100% US Treasury Bills Backed
                </div>
              </div>

              {/* Tile 2: Yield Arbitrage Semi-Gauge (Lợi nhuận thụ động mô phỏng) */}
              <div style={{ backgroundColor: "#f8fafc", borderRadius: "22px", padding: "22px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "#64748b" }}>SIMULATED REVENUE</span>
                    <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: "2px 0 0 0" }}>Dòng Tiền Thụ Động</h3>
                  </div>
                  <span style={{ backgroundColor: "#eff6ff", color: "#2563eb", fontSize: "11px", fontWeight: "800", padding: "3px 8px", borderRadius: "8px" }}>Zero Liquidation</span>
                </div>

                {/* Semi Gauge Speedometer Graphic */}
                <div style={{ margin: "16px auto", textAlign: "center" }}>
                  <div style={{ fontSize: "32px", fontWeight: "800", color: "#2563eb", letterSpacing: "-0.5px" }}>
                    +${annualCashflow.toLocaleString()}
                  </div>
                  <div style={{ fontSize: "12px", color: "#10b981", fontWeight: "700", marginTop: "2px" }}>
                    ≈ ${monthlyCashflow.toLocaleString()} / tháng tiền tươi
                  </div>
                </div>

                {/* Capital Slider Mini */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: "700", color: "#64748b", marginBottom: "4px" }}>
                    <span>Vốn: ${capital.toLocaleString()}</span>
                    <span>Fed Rate: {fedShift >= 0 ? `+${fedShift}` : fedShift} bps</span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="500000"
                    step="10000"
                    value={capital}
                    onChange={(e) => setCapital(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#2563eb", cursor: "pointer" }}
                  />
                </div>
              </div>

              {/* Tile 3: DEX Vulnerability Radar */}
              <div style={{ backgroundColor: "#f8fafc", borderRadius: "22px", padding: "22px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "#64748b" }}>DEX RADAR</span>
                    <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: "2px 0 0 0" }}>Bẫy Thanh Khoản</h3>
                  </div>
                  <span style={{ backgroundColor: "#fef2f2", color: "#ef4444", fontSize: "11px", fontWeight: "800", padding: "3px 8px", borderRadius: "8px" }}>1 Cảnh Báo</span>
                </div>

                <div style={{ padding: "12px", backgroundColor: "#ffffff", borderRadius: "14px", border: "1px solid #fecaca", margin: "14px 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: "800", color: "#ef4444", fontSize: "13px" }}>HAWK_AI Token</span>
                    <span style={{ fontSize: "11px", fontWeight: "700", backgroundColor: "#fee2e2", color: "#b91c1c", padding: "2px 6px", borderRadius: "6px" }}>Vol/Mcap 0.006</span>
                  </div>
                  <p style={{ margin: "4px 0 0 0", fontSize: "11px", color: "#7f1d1d", lineHeight: "1.4" }}>
                    Bẫy thanh khoản cực nặng. Lệnh xả trên $3,000 sẽ trượt giá 12% - 25%.
                  </p>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748b" }}>
                  <span>BTC/ETH Liquidity:</span>
                  <strong style={{ color: "#10b981" }}>Tối ưu (Safe)</strong>
                </div>
              </div>

            </div>

            {/* ROW 2: DETAILED TABLE / SIMULATOR (Dựa theo Active Tab) */}
            <div style={{ backgroundColor: "#f8fafc", borderRadius: "22px", padding: "24px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <div>
                  <h3 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                    {activeTab === "dex" ? "Radar Quét Trượt Giá & Rửa Tiền DEX" : "Bảng Quỹ Trái Phiếu Kho Bạc Mỹ Token Hóa (RWA)"}
                  </h3>
                  <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0 0" }}>
                    {activeTab === "dex" ? "Phân tích tự động từ khối lượng giao dịch và vốn hóa CoinMarketCap" : "Lãi suất thực tế được bảo chứng bằng Trái phiếu Kho bạc và Hợp đồng Repo"}
                  </p>
                </div>
                <div style={{ fontSize: "12px", fontWeight: "700", color: "#2563eb" }}>
                  {activeTab === "dex" ? "Live DEX Feed" : "4 Quỹ Hàng Đầu Thế Giới"}
                </div>
              </div>

              {activeTab === "dex" ? (
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ color: "#64748b", borderBottom: "1px solid #e2e8f0" }}>
                      <th style={{ padding: "10px 14px" }}>TOKEN</th>
                      <th style={{ padding: "10px 14px" }}>GIÁ THỊ TRƯỜNG</th>
                      <th style={{ padding: "10px 14px" }}>24H VOLUME</th>
                      <th style={{ padding: "10px 14px" }}>VOL/MCAP RATIO</th>
                      <th style={{ padding: "10px 14px" }}>TRẠNG THÁI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dexTokens.map((t, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "14px", fontWeight: "700", color: "#0f172a" }}>{t.symbol} <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "normal" }}>({t.name})</span></td>
                        <td style={{ padding: "14px", color: "#0f172a", fontWeight: "600" }}>{t.price}</td>
                        <td style={{ padding: "14px", color: "#64748b" }}>{t.vol}</td>
                        <td style={{ padding: "14px", fontWeight: "800", color: t.color }}>{t.ratio}</td>
                        <td style={{ padding: "14px" }}>
                          <span style={{ backgroundColor: t.status === "SAFE" ? "#ecfdf5" : "#fef2f2", color: t.status === "SAFE" ? "#059669" : "#dc2626", fontWeight: "800", fontSize: "11px", padding: "4px 10px", borderRadius: "8px" }}>
                            {t.status === "SAFE" ? "✓ AN TOÀN" : "⚠ BẪY THANH KHOẢN"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ color: "#64748b", borderBottom: "1px solid #e2e8f0" }}>
                      <th style={{ padding: "10px 14px" }}>QUỸ RWA</th>
                      <th style={{ padding: "10px 14px" }}>TỔ CHỨC PHÁT HÀNH</th>
                      <th style={{ padding: "14px 14px" }}>QUY MÔ (AUM)</th>
                      <th style={{ padding: "10px 14px" }}>LÃI SUẤT APY</th>
                      <th style={{ padding: "10px 14px" }}>ĐỘ AN TOÀN</th>
                      <th style={{ padding: "10px 14px" }}>MÔ PHỎNG</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rwaList.map((r, i) => {
                      const isSel = selectedAsset === r.symbol;
                      return (
                        <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: isSel ? "#eff6ff" : "transparent" }}>
                          <td style={{ padding: "14px", fontWeight: "800", color: "#0f172a" }}>{r.symbol} <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "normal" }}>({r.name})</span></td>
                          <td style={{ padding: "14px", color: "#475569" }}>{r.issuer}</td>
                          <td style={{ padding: "14px", fontWeight: "700", color: "#2563eb" }}>{r.aum}</td>
                          <td style={{ padding: "14px", fontWeight: "800", color: "#10b981", fontSize: "14px" }}>{r.apy}%</td>
                          <td style={{ padding: "14px" }}>
                            <span style={{ backgroundColor: "#f1f5f9", color: "#0f172a", fontSize: "11px", fontWeight: "700", padding: "4px 8px", borderRadius: "6px" }}>{r.risk}</span>
                          </td>
                          <td style={{ padding: "14px" }}>
                            <button
                              onClick={() => setSelectedAsset(r.symbol)}
                              style={{
                                border: isSel ? "1px solid #2563eb" : "1px solid #cbd5e1",
                                backgroundColor: isSel ? "#2563eb" : "#ffffff",
                                color: isSel ? "#ffffff" : "#0f172a",
                                padding: "4px 12px",
                                borderRadius: "8px",
                                fontSize: "11px",
                                fontWeight: "700",
                                cursor: "pointer",
                              }}
                            >
                              {isSel ? "Đang chọn" : "Chọn"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: INTERACTIVE COPILOT CHAT & PORTFOLIO ALLOCATION */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Widget 1: Macro Asset Allocation (như Team Tasks card) */}
            <div style={{ backgroundColor: "#f8fafc", borderRadius: "22px", padding: "22px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <span style={{ fontSize: "13px", fontWeight: "800", color: "#0f172a" }}>Phân Bổ Danh Mục Định Chế</span>
                <span style={{ fontSize: "11px", color: "#2563eb", fontWeight: "700" }}>Tự Động Rebalance</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ padding: "10px 14px", backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ fontSize: "13px", color: "#0f172a" }}>Bitcoin (BTC)</strong>
                    <div style={{ fontSize: "10px", color: "#64748b" }}>Trụ cột chống lạm phát</div>
                  </div>
                  <strong style={{ color: "#f59e0b", fontSize: "15px" }}>45%</strong>
                </div>

                <div style={{ padding: "10px 14px", backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ fontSize: "13px", color: "#0f172a" }}>RWA Treasuries (USDY/BUIDL)</strong>
                    <div style={{ fontSize: "10px", color: "#64748b" }}>Khóa lãi 5.15% APY dòng tiền an toàn</div>
                  </div>
                  <strong style={{ color: "#10b981", fontSize: "15px" }}>35%</strong>
                </div>

                <div style={{ padding: "10px 14px", backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ fontSize: "13px", color: "#0f172a" }}>Ethereum (ETH Staking)</strong>
                    <div style={{ fontSize: "10px", color: "#64748b" }}>Lợi suất mạng lưới DeFi</div>
                  </div>
                  <strong style={{ color: "#3b82f6", fontSize: "15px" }}>15%</strong>
                </div>

                <div style={{ padding: "10px 14px", backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ fontSize: "13px", color: "#0f172a" }}>Cash Buffer</strong>
                    <div style={{ fontSize: "10px", color: "#64748b" }}>Sẵn sàng bắt đáy</div>
                  </div>
                  <strong style={{ color: "#64748b", fontSize: "15px" }}>5%</strong>
                </div>
              </div>
            </div>

            {/* Widget 2: AI Copilot Chat (như Team Chat widget Dribbble) */}
            <div style={{ backgroundColor: "#f8fafc", borderRadius: "22px", padding: "22px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", height: "420px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "10px", backgroundColor: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Bot size={18} color="#ffffff" />
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "800", color: "#0f172a" }}>Sentinel Copilot</div>
                  <div style={{ fontSize: "10px", color: "#10b981", fontWeight: "700" }}>● Sẵn sàng phân tích</div>
                </div>
              </div>

              {/* Chat messages */}
              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", paddingRight: "4px" }}>
                {chatMessages.map((msg, i) => (
                  <div key={i} style={{ alignSelf: msg.sender === "user" ? "flex-end" : "flex-start", maxWidth: "90%" }}>
                    <div
                      style={{
                        padding: "10px 14px",
                        borderRadius: "14px",
                        fontSize: "12px",
                        lineHeight: "1.5",
                        backgroundColor: msg.sender === "user" ? "#2563eb" : "#ffffff",
                        color: msg.sender === "user" ? "#ffffff" : "#1e293b",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                        border: msg.sender === "user" ? "none" : "1px solid #e2e8f0",
                      }}
                    >
                      {msg.text}
                    </div>
                    <div style={{ fontSize: "9px", color: "#94a3b8", textAlign: msg.sender === "user" ? "right" : "left", marginTop: "2px" }}>{msg.time}</div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div style={{ marginTop: "12px", display: "flex", gap: "6px" }}>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Hỏi lãi suất BUIDL, USDY hoặc rủi ro DEX..."
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    fontSize: "12px",
                    outline: "none",
                    backgroundColor: "#ffffff",
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  style={{
                    padding: "0 14px",
                    borderRadius: "10px",
                    backgroundColor: "#2563eb",
                    color: "#ffffff",
                    border: "none",
                    fontWeight: "700",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  Gửi
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default App;
