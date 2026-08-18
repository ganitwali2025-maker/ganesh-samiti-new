import React, { useState, useEffect, useMemo } from "react";
import { Home, Users, PiggyBank, Receipt, Plus, Trash2, ChevronRight, ArrowLeft, BarChart3, List, Calendar, Coins, HeartHandshake, Menu, Settings, X, FileDown, FileUp, LogOut } from "lucide-react";

const uid = () => Math.random().toString(36).slice(2, 10);
const fmt = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");
const todayStr = () => new Date().toISOString().slice(0, 10);
const dispDate = (d) => {
  const dt = new Date(d);
  return dt.toLocaleDateString("hi-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const STORAGE_KEY = "hisaab-data-v1";

const AVATAR_COLORS = ["#766ED3", "#9D97E8", "#B584DF", "#8E76D9", "#A682D4", "#6B59B3"];
const colorFor = (str) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
};

export default function HisaabApp() {
  const [data, setData] = useState(() => {
    try {
      const res = localStorage.getItem(STORAGE_KEY);
      return res ? JSON.parse(res) : { members: [], jama: [], expenses: [] };
    } catch (e) {
      return { members: [], jama: [], expenses: [] };
    }
  });
  const [tab, setTab] = useState("home");
  const [activePage, setActivePage] = useState(null);
  const [toast, setToast] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
  }, [data]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 1800);
  };

  const totals = useMemo(() => {
    const totalJama = data.jama.reduce((s, j) => s + Number(j.amount), 0);
    const totalExpense = data.expenses.reduce((s, e) => s + Number(e.amount), 0);
    return { totalJama, totalExpense, balance: totalJama - totalExpense, members: data.members.length };
  }, [data]);

  const transactions = useMemo(() => {
    const j = data.jama.map((x) => ({ ...x, type: "jama" }));
    const e = data.expenses.map((x) => ({ ...x, type: "expense" }));
    return [...j, ...e].sort((a, b) => new Date(b.date) - new Date(a.date) || b.createdAt - a.createdAt);
  }, [data]);

  const addMember = (name) => {
    if (!name.trim()) return;
    setData((d) => ({ ...d, members: [...d.members, { id: uid(), name: name.trim() }] }));
    showToast("सदस्य जोड़ा गया");
  };
  const removeMember = (id) => {
    setData((d) => ({ ...d, members: d.members.filter((m) => m.id !== id) }));
  };
  const addJama = ({ memberId, amount, date, note, category }) => {
    setData((d) => ({
      ...d,
      jama: [...d.jama, { id: uid(), memberId, amount: Number(amount), date, note, category: category || "chanda", createdAt: Date.now() }],
    }));
    showToast("जमा दर्ज हुई");
  };
  const addExpense = ({ desc, amount, date }) => {
    setData((d) => ({
      ...d,
      expenses: [...d.expenses, { id: uid(), desc, amount: Number(amount), date, createdAt: Date.now() }],
    }));
    showToast("खर्च दर्ज हुआ");
  };
  const removeJama = (id) => setData((d) => ({ ...d, jama: d.jama.filter((j) => j.id !== id) }));
  const removeExpense = (id) => setData((d) => ({ ...d, expenses: d.expenses.filter((e) => e.id !== id) }));
  const memberName = (id) => data.members.find((m) => m.id === id)?.name || "अज्ञात सदस्य";

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Hind:wght@500;600;700;800&family=JetBrains+Mono:wght@600;700&display=swap');
        .hb-scroll::-webkit-scrollbar{display:none}
        .hb-btn{transition:transform .12s ease, opacity .12s ease}
        .hb-btn:active{transform:scale(0.96)}
        .hb-navitem{transition:color .15s ease}
        .hb-card{transition:transform .12s ease}
        .hb-card:active{transform:scale(0.97)}
        .hb-fadein{animation:hbFade .25s ease}
        @keyframes hbFade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        input, select{font-family:'Hind',sans-serif;font-weight:700}
        body,div,span,p{font-weight:700}
      `}</style>

      <div style={styles.phoneFrame}>
        {/* Main Header (Hidden when on a full page) */}
        {!activePage && (
          <div style={styles.appHeader}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button className="hb-btn" onClick={() => setIsSidebarOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
                <Menu size={24} color="#1E1638" />
              </button>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg, #6B59B3 0%, #4C3F8A 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(107, 89, 179, 0.3)" }}>
                <span style={{ fontSize: 18, color: "#FFF" }}>🕉️</span>
              </div>
              <div>
                <div style={{ fontFamily: "Baloo 2, sans-serif", fontSize: 20, fontWeight: 800, color: "#1E1638", lineHeight: 1.1 }}>गणेश उत्सव</div>
                <div style={{ fontSize: 11, color: "#7A849C", fontFamily: "Hind, sans-serif", fontWeight: 700 }}>हिसाब किताब 2026</div>
              </div>
            </div>
            <button className="hb-btn" onClick={() => setIsSettingsOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
              <Settings size={24} color="#A0AABF" />
            </button>
          </div>
        )}

        {/* Main Content Area */}
        {!activePage && (
          <div className="hb-scroll" style={styles.screen}>
            {tab === "home" && (
              <HomeScreen
                totals={totals}
                transactions={transactions.slice(0, 5)}
                memberName={memberName}
                setTab={setTab}
                setActivePage={setActivePage}
              />
            )}
            {tab === "collection" && (
              <CollectionMenuScreen setActivePage={setActivePage} totals={totals} />
            )}
            {tab === "members" && (
              <MembersScreen
                members={data.members}
                jama={data.jama}
                onAdd={() => setActivePage("addMember")}
                onRemove={removeMember}
              />
            )}
            {tab === "expense" && (
              <ExpenseScreen
                expenses={data.expenses}
                total={totals.totalExpense}
                onAdd={() => setActivePage("addExpense")}
                onRemove={removeExpense}
              />
            )}
            {tab === "reports" && (
              <ReportsScreen transactions={transactions} memberName={memberName} balance={totals.balance} />
            )}
          </div>
        )}

        {/* Bottom Navigation (Hidden when on a full page) */}
        {!activePage && (
          <div style={styles.bottomNav}>
            <NavItem icon={<Home size={20} />} label="होम" active={tab === "home"} onClick={() => setTab("home")} />
            <NavItem icon={<PiggyBank size={20} />} label="Collection" active={tab === "collection"} onClick={() => setTab("collection")} />
            <NavItem icon={<Users size={20} />} label="सदस्य" active={tab === "members"} onClick={() => setTab("members")} />
            <NavItem icon={<Receipt size={20} />} label="खर्च" active={tab === "expense"} onClick={() => setTab("expense")} />
            <NavItem icon={<BarChart3 size={20} />} label="Reports" active={tab === "reports"} onClick={() => setTab("reports")} />
          </div>
        )}

        {/* Full Page Modals/Screens */}
        {activePage && activePage.startsWith("collection/") && (
          <JamaCategoryScreen
            category={activePage.split("/")[1]}
            jama={data.jama}
            members={data.members}
            memberName={memberName}
            onAdd={addJama}
            onRemove={removeJama}
            onClose={() => setActivePage(null)}
          />
        )}
        {activePage === "addMember" && (
          <AddMemberScreen onClose={() => setActivePage(null)} onSave={addMember} />
        )}
        {activePage === "addExpense" && (
          <AddExpenseScreen onClose={() => setActivePage(null)} onSave={addExpense} />
        )}

        {/* Toast */}
        {toast && <div style={styles.toast}>{toast}</div>}
      </div>

      </div>

      {/* Sidebar Overlay and Drawer */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.5)",
        opacity: isSidebarOpen ? 1 : 0, pointerEvents: isSidebarOpen ? "auto" : "none", transition: "opacity 0.3s ease"
      }} onClick={() => setIsSidebarOpen(false)} />
      
      <div style={{
        position: "absolute", top: 0, bottom: 0, left: 0, width: "80%", maxWidth: 320, background: "#FFF", zIndex: 1000,
        transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.3s ease",
        display: "flex", flexDirection: "column", boxShadow: "4px 0 24px rgba(0,0,0,0.15)"
      }}>
        <div style={{ background: "#4B20B5", color: "#FFF", padding: "24px 24px 20px", display: "flex", flexDirection: "column", justifyContent: "flex-end", height: 140, position: "relative" }}>
          <button onClick={() => setIsSidebarOpen(false)} style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.15)", border: "none", color: "#FFF", borderRadius: "50%", padding: 6, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={20} />
          </button>
          <div style={{ fontFamily: "Baloo 2, sans-serif", fontSize: 22, fontWeight: 800, lineHeight: 1.2 }}>गणेश समिति ऐप</div>
          <div style={{ fontSize: 12, color: "#D6CCF0", fontFamily: "Hind, sans-serif" }}>समिति का लेखा-जोखा</div>
        </div>
        
        <div className="hb-scroll" style={{ flex: 1, overflowY: "auto", padding: "16px 0" }}>
          <SidebarItem icon={<Home size={22} />} label="होम" active={tab === "home"} onClick={() => { setTab("home"); setIsSidebarOpen(false); }} />
          <SidebarItem icon={<PiggyBank size={22} />} label="जमा (Collection)" active={tab === "collection"} onClick={() => { setTab("collection"); setIsSidebarOpen(false); }} />
          <SidebarItem icon={<Users size={22} />} label="सदस्य" active={tab === "members"} onClick={() => { setTab("members"); setIsSidebarOpen(false); }} />
          <SidebarItem icon={<Receipt size={22} />} label="खर्च शीट" active={tab === "expense"} onClick={() => { setTab("expense"); setIsSidebarOpen(false); }} />
          <SidebarItem icon={<BarChart3 size={22} />} label="रिपोर्ट्स" active={tab === "reports"} onClick={() => { setTab("reports"); setIsSidebarOpen(false); }} />
          
          <div style={{ height: 1, background: "#E2E8F0", margin: "16px 24px" }} />
          
          <SidebarItem icon={<Settings size={22} />} label="सेटिंग्स" active={false} onClick={() => { setIsSidebarOpen(false); setIsSettingsOpen(true); }} />
          <SidebarItem icon={<LogOut size={22} />} label="लॉगआउट" active={false} onClick={() => setIsSidebarOpen(false)} color="#D95F5F" />
        </div>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <FullPageScreen title="सेटिंग्स" onClose={() => setIsSettingsOpen(false)}>
          <div style={{ background: "#FFFFFF", padding: "20px 16px", borderRadius: 20, border: "1px solid #E2E8F0", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
            <div style={{ fontSize: 16, fontFamily: "Baloo 2, sans-serif", fontWeight: 800, color: "#1E1638", marginBottom: 12 }}>ऐप सेटिंग्स</div>
            <EmptyNote text="यहां जल्द ही सेटिंग्स के विकल्प जोड़े जाएंगे।" />
          </div>
        </FullPageScreen>
      )}

    </div>
  );
}

function SidebarItem({ icon, label, active, onClick, color = "#1E1638" }) {
  return (
    <button
      className="hb-btn"
      onClick={onClick}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 16, padding: "14px 24px",
        background: active ? "#F3F0FA" : "transparent", border: "none", borderRight: active ? "4px solid #4B20B5" : "4px solid transparent",
        cursor: "pointer", transition: "background 0.2s"
      }}
    >
      <div style={{ color: active ? "#4B20B5" : "#7A849C" }}>{icon}</div>
      <div style={{ fontSize: 15, fontFamily: "Hind, sans-serif", fontWeight: active ? 800 : 700, color: active ? "#4B20B5" : color }}>
        {label}
      </div>
    </button>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      className="hb-navitem hb-btn"
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        color: active ? "#6B59B3" : "#A0AABF",
        cursor: "pointer",
        flex: 1,
        padding: "6px 0",
      }}
    >
      {icon}
      <span style={{ fontSize: 10.5, fontFamily: "Hind, sans-serif", fontWeight: active ? 700 : 600 }}>{label}</span>
    </button>
  );
}

function HomeScreen({ totals, transactions, memberName, setTab, setActivePage }) {
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "शुभ प्रभात ☀️";
    if (h < 17) return "शुभ दोपहर 🌤️";
    return "शुभ संध्या 🌙";
  }, []);

  const ringPct = totals.totalJama > 0 ? Math.min(100, Math.round((totals.balance / totals.totalJama) * 100)) : 0;
  const circumference = 2 * Math.PI * 54;
  const ringOffset = circumference - (Math.max(0, ringPct) / 100) * circumference;

  return (
    <div className="hb-fadein" style={{ padding: "14px 16px 24px" }}>
      <div style={{ fontSize: 14, color: "#1E1638", fontFamily: "Hind, sans-serif", fontWeight: 800, marginBottom: 14 }}>
        {greeting}
      </div>

      {/* Hero Wallet Card */}
      <div style={{ ...styles.heroCard, background: "linear-gradient(135deg, #6B59B3 0%, #4C3F8A 100%)", border: "none", padding: "20px 16px", boxShadow: "0 10px 24px rgba(76, 63, 138, 0.25)" }}>
        <div style={{ position: "relative", width: 124, height: 124, margin: "0 auto" }}>
          <svg width="124" height="124" viewBox="0 0 124 124">
            <circle cx="62" cy="62" r="54" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
            <circle
              cx="62"
              cy="62"
              r="54"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={ringOffset}
              transform="rotate(-90 62 62)"
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 10.5, color: "#D6CCF0", fontFamily: "Hind, sans-serif" }}>कुल उपलब्ध बैलेंस</span>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 18, fontWeight: 800, color: "#FFFFFF" }}>{fmt(totals.balance)}</span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 22, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.15)" }}>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 11.5, color: "#D6CCF0", fontFamily: "Hind, sans-serif" }}>कुल जमा</div>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 14.5, fontWeight: 800, color: "#E2F6E2" }}>{fmt(totals.totalJama)}</div>
          </div>
          <div style={{ width: 1, background: "rgba(255,255,255,0.15)" }} />
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 11.5, color: "#D6CCF0", fontFamily: "Hind, sans-serif" }}>कुल खर्च</div>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 14.5, fontWeight: 800, color: "#FDE2E2" }}>{fmt(totals.totalExpense)}</div>
          </div>
        </div>
      </div>



      {/* Mini Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
        <StatBox label="कुल सदस्य" value={totals.members + " लोग"} tint="#FFFFFF" accent="#1E1638" onClick={() => setTab("members")} />
        <StatBox label="लेन-देन" value={transactions.length + " एंट्री"} tint="#FFFFFF" accent="#1E1638" onClick={() => setTab("reports")} />
      </div>

      {/* Recent Txns */}
      <div style={{ marginTop: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: "#1E1638", fontFamily: "Hind, sans-serif" }}>हाल की लेन-देन</span>
          <button className="hb-btn" onClick={() => setTab("reports")} style={styles.linkBtn}>
            सभी देखें <ChevronRight size={14} />
          </button>
        </div>
        {transactions.length === 0 ? (
          <EmptyNote text="अभी कोई लेन-देन नहीं है।" />
        ) : (
          <div style={styles.cardContainer}>
            {transactions.map((t, i) => (
              <TxnRow key={t.id} t={t} memberName={memberName} isLast={i === transactions.length - 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CollectionMenuScreen({ setActivePage, totals }) {
  return (
    <div className="hb-fadein" style={{ padding: "18px 16px 24px" }}>
      <ScreenHeader title="Collection" subtitle={`कुल जमा: ${fmt(totals.totalJama)}`} accent="#4C3F8A" />
      
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <CollectionCard 
          icon={<Calendar size={22} color="#1E1638" />}
          title="Monthly Jama"
          subtitle="मासिक जमा का हिसाब"
          onClick={() => setActivePage("collection/monthly")}
          bg="#F8F9FA"
        />
        <CollectionCard 
          icon={<Coins size={22} color="#4C3F8A" />}
          title="Chanda Jama"
          subtitle="चंदा और दान"
          onClick={() => setActivePage("collection/chanda")}
          bg="#F0F4FF"
        />
        <CollectionCard 
          icon={<span style={{fontSize: 22}}>🕉️</span>}
          title="Ganesh Chaturthi Jama"
          subtitle="गणेश उत्सव स्पेशल जमा"
          onClick={() => setActivePage("collection/ganesh")}
          bg="#FFF5E6"
        />
        <CollectionCard 
          icon={<HeartHandshake size={22} color="#D95F5F" />}
          title="Sahyog Jama"
          subtitle="अन्य सहयोग राशि"
          onClick={() => setActivePage("collection/sahyog")}
          bg="#FFF0F0"
        />
        <div style={{height: 8}} />
        <CollectionCard 
          icon={<List size={22} color="#6B59B3" />}
          title="Collection Data / History"
          subtitle="सभी जमाओं की लिस्ट"
          onClick={() => setActivePage("collection/history")}
          bg="#F3F0FA"
        />
      </div>
    </div>
  );
}

function CollectionCard({ icon, title, subtitle, onClick, bg }) {
  return (
    <button className="hb-card hb-btn" onClick={onClick} style={{ 
      display: "flex", 
      alignItems: "center", 
      gap: 16, 
      padding: "16px", 
      background: "#FFFFFF", 
      border: "1px solid #E2E8F0", 
      borderRadius: 16, 
      cursor: "pointer",
      boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
      textAlign: "left"
    }}>
      <div style={{ width: 48, height: 48, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#1E1638", fontFamily: "Hind, sans-serif" }}>{title}</div>
        <div style={{ fontSize: 12, color: "#7A849C", fontFamily: "Hind, sans-serif", marginTop: 2 }}>{subtitle}</div>
      </div>
      <ChevronRight size={20} color="#A0AABF" />
    </button>
  );
}

function QuickAction({ icon, label, bg, onClick }) {
  return (
    <button className="hb-card hb-btn" onClick={onClick} style={{ flex: 1, background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 16, padding: "14px 4px", display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", gap: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
      <div style={{ width: 44, height: 44, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: "#1E1638", fontFamily: "Hind, sans-serif" }}>{label}</span>
    </button>
  );
}

function StatBox({ label, value, tint, accent, onClick }) {
  return (
    <button className="hb-card hb-btn" onClick={onClick} style={{ ...styles.statBox, background: tint, cursor: "pointer" }}>
      <div style={{ fontSize: 11.5, color: "#7A849C", fontFamily: "Hind, sans-serif", marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 16, fontWeight: 800, color: accent }}>{value}</div>
    </button>
  );
}

function TxnRow({ t, memberName, isLast }) {
  const isJama = t.type === "jama";
  return (
    <div style={{ ...styles.txnRow, borderBottom: isLast ? "none" : "1px solid #E2E8F0" }}>
      <div style={{ ...styles.txnIcon, background: isJama ? "#F0F4FF" : "#FFF0F0" }}>
        {isJama ? <PiggyBank size={15} color="#4C3F8A" /> : <Receipt size={15} color="#D95F5F" />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, color: "#1E1638", fontFamily: "Hind, sans-serif", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {isJama ? memberName(t.memberId) : t.desc}
        </div>
        <div style={{ fontSize: 11, color: "#7A849C", fontFamily: "Hind, sans-serif" }}>{dispDate(t.date)}</div>
      </div>
      <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 14, fontWeight: 800, color: isJama ? "#4C3F8A" : "#D95F5F" }}>
        {isJama ? "+" : "-"}{fmt(t.amount)}
      </div>
    </div>
  );
}

function MembersScreen({ members, jama, onAdd, onRemove }) {
  const memberTotal = (id) => jama.filter((j) => j.memberId === id).reduce((s, j) => s + Number(j.amount), 0);
  return (
    <div className="hb-fadein" style={{ padding: "18px 16px 24px" }}>
      <ScreenHeader title="सदस्य" subtitle={`${members.length} सदस्य जुड़े हैं`} onAdd={onAdd} addLabel="सदस्य जोड़ें" />
      {members.length === 0 ? (
        <EmptyNote text="कोई सदस्य नहीं है। नया सदस्य जोड़ें।" />
      ) : (
        <div style={styles.cardContainer}>
          {members.map((m, i) => (
            <div key={m.id} style={{ ...styles.listRow, borderBottom: i === members.length - 1 ? "none" : "1px solid #E2E8F0" }}>
              <div style={{ ...styles.avatar, background: colorFor(m.name) }}>{m.name.trim().slice(0, 1).toUpperCase()}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, color: "#1E1638", fontFamily: "Hind, sans-serif", fontWeight: 700 }}>{m.name}</div>
                <div style={{ fontSize: 11.5, color: "#7A849C", fontFamily: "Hind, sans-serif" }}>कुल जमा: {fmt(memberTotal(m.id))}</div>
              </div>
              <button className="hb-btn" onClick={() => onRemove(m.id)} style={styles.trashBtn} aria-label="हटाएं">
                <Trash2 size={16} color="#D95F5F" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ExpenseScreen({ expenses, total, onAdd, onRemove }) {
  const sorted = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
  return (
    <div className="hb-fadein" style={{ padding: "18px 16px 24px" }}>
      <ScreenHeader title="खर्च शीट" subtitle={`कुल खर्च: ${fmt(total)}`} onAdd={onAdd} addLabel="खर्च जोड़ें" accent="#D95F5F" />
      {sorted.length === 0 ? (
        <EmptyNote text="अभी कोई खर्च दर्ज नहीं है।" />
      ) : (
        <div style={styles.cardContainer}>
          {sorted.map((e, i) => (
            <div key={e.id} style={{ ...styles.listRow, borderBottom: i === sorted.length - 1 ? "none" : "1px solid #E2E8F0" }}>
              <div style={{ ...styles.avatar, background: "#FFF0F0" }}>
                <Receipt size={16} color="#D95F5F" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, color: "#1E1638", fontFamily: "Hind, sans-serif", fontWeight: 700 }}>{e.desc}</div>
                <div style={{ fontSize: 11.5, color: "#7A849C", fontFamily: "Hind, sans-serif" }}>{dispDate(e.date)}</div>
              </div>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 14, fontWeight: 800, color: "#D95F5F", marginRight: 8 }}>
                -{fmt(e.amount)}
              </div>
              <button className="hb-btn" onClick={() => onRemove(e.id)} style={styles.trashBtn} aria-label="हटाएं">
                <Trash2 size={15} color="#A0AABF" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ReportsScreen({ transactions, memberName, balance }) {
  let running = balance;
  const rows = transactions.map((t) => {
    const row = { ...t, runningBalance: running };
    running = t.type === "jama" ? running - t.amount : running + t.amount;
    return row;
  });
  return (
    <div className="hb-fadein" style={{ padding: "18px 16px 24px" }}>
      <ScreenHeader title="Reports" subtitle={`कुल ${transactions.length} लेन-देन`} />
      {rows.length === 0 ? (
        <EmptyNote text="अभी कोई लेन-देन नहीं है।" />
      ) : (
        <div style={styles.cardContainer}>
          {rows.map((t, i) => (
            <div key={t.id} style={{ ...styles.txnRow, borderBottom: i === rows.length - 1 ? "none" : "1px solid #E2E8F0" }}>
              <div style={{ ...styles.txnIcon, background: t.type === "jama" ? "#F0F4FF" : "#FFF0F0" }}>
                {t.type === "jama" ? <PiggyBank size={15} color="#4C3F8A" /> : <Receipt size={15} color="#D95F5F" />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, color: "#1E1638", fontFamily: "Hind, sans-serif", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {t.type === "jama" ? memberName(t.memberId) : t.desc}
                </div>
                <div style={{ fontSize: 11, color: "#7A849C", fontFamily: "Hind, sans-serif" }}>{dispDate(t.date)}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 14, fontWeight: 800, color: t.type === "jama" ? "#4C3F8A" : "#D95F5F" }}>
                  {t.type === "jama" ? "+" : "-"}{fmt(t.amount)}
                </div>
                <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10.5, color: "#7A849C" }}>शेष {fmt(t.runningBalance)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ScreenHeader({ title, subtitle, onAdd, addLabel, accent = "#6B59B3" }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18 }}>
      <div>
        <div style={{ fontFamily: "Baloo 2, sans-serif", fontSize: 22, fontWeight: 800, color: "#1E1638" }}>{title}</div>
        <div style={{ fontSize: 12.5, color: "#7A849C", fontFamily: "Hind, sans-serif", marginTop: 2 }}>{subtitle}</div>
      </div>
      {onAdd && (
        <button className="hb-btn" onClick={onAdd} style={{ ...styles.addBtn, background: accent }}>
          <Plus size={16} color="#FFFFFF" />
        </button>
      )}
    </div>
  );
}

function EmptyNote({ text }) {
  return (
    <div style={{ textAlign: "center", padding: "40px 16px", color: "#A0AABF", fontSize: 13.5, fontFamily: "Hind, sans-serif" }}>
      {text}
    </div>
  );
}

function FullPageScreen({ title, onClose, children }) {
  return (
    <div className="hb-fadein" style={{ position: "absolute", inset: 0, background: "#F8F9FA", zIndex: 100, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px 12px", background: "#FFFFFF", borderBottom: "1px solid #E2E8F0" }}>
        <button className="hb-btn" onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 4px 4px 0", display: "flex", alignItems: "center" }} aria-label="वापस जाएं">
          <ArrowLeft size={24} color="#1E1638" />
        </button>
        <div style={{ fontFamily: "Baloo 2, sans-serif", fontSize: 20, fontWeight: 800, color: "#1E1638" }}>{title}</div>
      </div>
      <div className="hb-scroll" style={{ flex: 1, overflowY: "auto", padding: "20px 16px" }}>
        {children}
      </div>
    </div>
  );
}

function JamaCategoryScreen({ category, jama, members, memberName, onAdd, onRemove, onClose }) {
  const isHistory = category === "history";
  
  const titleMap = {
    monthly: "Monthly Jama",
    chanda: "Chanda Jama",
    ganesh: "Ganesh Chaturthi Jama",
    sahyog: "Sahyog Jama",
    history: "Collection History"
  };
  
  const title = titleMap[category] || "Jama";
  const filtered = category === "history" ? jama : jama.filter(j => j.category === category);
  const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));

  const [memberId, setMemberId] = useState(members[0]?.id || "");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayStr());
  const [note, setNote] = useState("");
  const [err, setErr] = useState("");

  const submit = () => {
    if (!memberId) return setErr("पहले सदस्य जोड़ें");
    if (!amount || Number(amount) <= 0) return setErr("सही राशि डालें");
    onAdd({ memberId, amount, date, note, category });
    setAmount("");
    setNote("");
  };

  return (
    <FullPageScreen title={title} onClose={onClose}>
      {!isHistory && (
        <div style={{ background: "#FFFFFF", padding: "20px 16px", borderRadius: 20, border: "1px solid #E2E8F0", marginBottom: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: 16, fontFamily: "Baloo 2, sans-serif", fontWeight: 800, color: "#1E1638", marginBottom: 12 }}>नई एंट्री जोड़ें</div>
          <label style={styles.label}>सदस्य</label>
          {members.length === 0 ? (
            <div style={styles.errText}>पहले सदस्य जोड़ें, फिर जमा दर्ज करें।</div>
          ) : (
            <select style={styles.input} value={memberId} onChange={(e) => setMemberId(e.target.value)}>
              {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          )}
          <label style={styles.label}>राशि (₹)</label>
          <input style={styles.input} type="number" value={amount} onChange={(e) => { setAmount(e.target.value); setErr(""); }} placeholder="जैसे: 500" />
          <label style={styles.label}>तारीख</label>
          <input style={styles.input} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <label style={styles.label}>नोट (वैकल्पिक)</label>
          <input style={styles.input} value={note} onChange={(e) => setNote(e.target.value)} placeholder="जैसे: मासिक किस्त" />
          {err && <div style={styles.errText}>{err}</div>}
          <button className="hb-btn" onClick={submit} style={{ ...styles.submitBtn, marginTop: 20 }}>जमा जोड़ें</button>
        </div>
      )}

      <div style={{ fontSize: 16, fontFamily: "Baloo 2, sans-serif", fontWeight: 800, color: "#1E1638", marginBottom: 12 }}>
        {isHistory ? "सभी जमा (History)" : "हाल की एंट्रीज़"}
      </div>
      
      {sorted.length === 0 ? (
        <EmptyNote text="अभी कोई एंट्री नहीं है।" />
      ) : (
        <div style={styles.cardContainer}>
          {sorted.map((j, i) => (
            <div key={j.id} style={{ ...styles.listRow, borderBottom: i === sorted.length - 1 ? "none" : "1px solid #E2E8F0" }}>
              <div style={{ ...styles.avatar, background: colorFor(memberName(j.memberId)) }}>
                {memberName(j.memberId).trim().slice(0, 1).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, color: "#1E1638", fontFamily: "Hind, sans-serif", fontWeight: 700 }}>{memberName(j.memberId)}</div>
                <div style={{ fontSize: 11.5, color: "#7A849C", fontFamily: "Hind, sans-serif" }}>
                  {dispDate(j.date)}
                  {isHistory && j.category && ` · ${titleMap[j.category] || j.category}`}
                  {j.note ? ` · ${j.note}` : ""}
                </div>
              </div>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 14, fontWeight: 800, color: "#4C3F8A", marginRight: 8 }}>
                +{fmt(j.amount)}
              </div>
              <button className="hb-btn" onClick={() => onRemove(j.id)} style={styles.trashBtn} aria-label="हटाएं">
                <Trash2 size={15} color="#A0AABF" />
              </button>
            </div>
          ))}
        </div>
      )}
    </FullPageScreen>
  );
}

function AddMemberScreen({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const submit = () => {
    if (!name.trim()) return setErr("नाम लिखना ज़रूरी है");
    onSave(name);
    onClose();
  };
  return (
    <FullPageScreen title="नया सदस्य जोड़ें" onClose={onClose}>
      <div style={{ background: "#FFFFFF", padding: "20px 16px", borderRadius: 20, border: "1px solid #E2E8F0", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
        <label style={styles.label}>सदस्य का नाम</label>
        <input
          style={styles.input}
          value={name}
          onChange={(e) => { setName(e.target.value); setErr(""); }}
          placeholder="जैसे: रमेश कुमार"
          autoFocus
        />
        {err && <div style={styles.errText}>{err}</div>}
        <button className="hb-btn" onClick={submit} style={{...styles.submitBtn, marginTop: 20}}>जोड़ें</button>
      </div>
    </FullPageScreen>
  );
}

function AddExpenseScreen({ onClose, onSave }) {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayStr());
  const [err, setErr] = useState("");
  const submit = () => {
    if (!desc.trim()) return setErr("खर्च का विवरण लिखें");
    if (!amount || Number(amount) <= 0) return setErr("सही राशि डालें");
    onSave({ desc: desc.trim(), amount, date });
    onClose();
  };
  return (
    <FullPageScreen title="खर्च दर्ज करें" onClose={onClose}>
      <div style={{ background: "#FFFFFF", padding: "20px 16px", borderRadius: 20, border: "1px solid #E2E8F0", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
        <label style={styles.label}>विवरण</label>
        <input style={styles.input} value={desc} onChange={(e) => { setDesc(e.target.value); setErr(""); }} placeholder="जैसे: सजावट का सामान" autoFocus />
        <label style={styles.label}>राशि (₹)</label>
        <input style={styles.input} type="number" value={amount} onChange={(e) => { setAmount(e.target.value); setErr(""); }} placeholder="जैसे: 1200" />
        <label style={styles.label}>तारीख</label>
        <input style={styles.input} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        {err && <div style={styles.errText}>{err}</div>}
        <button className="hb-btn" onClick={submit} style={{...styles.submitBtn, marginTop: 20}}>खर्च जोड़ें</button>
      </div>
    </FullPageScreen>
  );
}

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    height: "100dvh",
    width: "100%",
    background: "#F8F9FA",
    fontFamily: "Hind, sans-serif",
    overflow: "hidden",
  },
  phoneFrame: {
    position: "relative",
    width: "100%",
    height: "100%",
    maxWidth: "1080px",
    background: "#F8F9FA",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  appHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px 12px",
    background: "#FFFFFF",
    borderBottom: "1px solid #E2E8F0",
    zIndex: 10,
  },
  screen: {
    flex: 1,
    overflowY: "auto",
  },
  bottomNav: {
    display: "flex",
    background: "#FFFFFF",
    borderTop: "1px solid #E2E8F0",
    padding: "6px 4px 10px",
  },
  heroCard: {
    borderRadius: 20,
  },
  statBox: {
    border: "1px solid #E2E8F0",
    borderRadius: 16,
    padding: "14px 16px",
    textAlign: "left",
    display: "block",
    width: "100%",
    boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
  },
  linkBtn: {
    background: "none",
    border: "none",
    color: "#6B59B3",
    fontSize: 12.5,
    fontWeight: 700,
    fontFamily: "Hind, sans-serif",
    display: "flex",
    alignItems: "center",
    gap: 2,
    cursor: "pointer",
    padding: 0,
  },
  cardContainer: {
    background: "#FFFFFF",
    borderRadius: 18,
    border: "1px solid #E2E8F0",
    padding: "4px 14px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
  },
  txnRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 0",
  },
  txnIcon: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  listRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 0",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: 800,
    flexShrink: 0,
    fontFamily: "Hind, sans-serif",
  },
  trashBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 8,
    flexShrink: 0,
  },
  addBtn: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(107, 89, 179, 0.3)",
  },
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 700,
    color: "#7A849C",
    fontFamily: "Hind, sans-serif",
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    background: "#F8F9FA",
    border: "1px solid #E2E8F0",
    borderRadius: 12,
    padding: "12px 14px",
    color: "#1E1638",
    fontSize: 14,
    outline: "none",
    transition: "border 0.2s ease",
  },
  errText: {
    color: "#D95F5F",
    fontSize: 12,
    fontFamily: "Hind, sans-serif",
    marginTop: 8,
  },
  submitBtn: {
    width: "100%",
    background: "#6B59B3",
    color: "#FFFFFF",
    border: "none",
    borderRadius: 12,
    padding: "14px 0",
    fontSize: 15,
    fontWeight: 800,
    cursor: "pointer",
    fontFamily: "Hind, sans-serif",
    boxShadow: "0 4px 12px rgba(107, 89, 179, 0.25)",
  },
  toast: {
    position: "absolute",
    bottom: 84,
    left: "50%",
    transform: "translateX(-50%)",
    background: "#1E1638",
    color: "#FFFFFF",
    padding: "10px 20px",
    borderRadius: 24,
    fontSize: 13,
    fontFamily: "Hind, sans-serif",
    fontWeight: 700,
    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
    zIndex: 60,
  },
};
