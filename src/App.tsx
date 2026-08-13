import React, { useState, useEffect, useMemo } from "react";
import { Home, Users, PiggyBank, Receipt, ArrowLeftRight, Plus, X, Trash2, ChevronRight } from "lucide-react";

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
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");

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
  const addJama = ({ memberId, amount, date, note }) => {
    setData((d) => ({
      ...d,
      jama: [...d.jama, { id: uid(), memberId, amount: Number(amount), date, note, createdAt: Date.now() }],
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
        <div style={styles.appHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg, #6B59B3 0%, #4C3F8A 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(107, 89, 179, 0.3)" }}>
              <span style={{ fontSize: 18, color: "#FFF" }}>🕉️</span>
            </div>
            <div>
              <div style={{ fontFamily: "Baloo 2, sans-serif", fontSize: 20, fontWeight: 800, color: "#1E1638", lineHeight: 1.1 }}>गणेश उत्सव</div>
              <div style={{ fontSize: 11, color: "#7A849C", fontFamily: "Hind, sans-serif", fontWeight: 700 }}>हिसाब किताब 2026</div>
            </div>
          </div>
        </div>

        <div className="hb-scroll" style={styles.screen}>
          {tab === "home" && (
            <HomeScreen
              totals={totals}
              transactions={transactions.slice(0, 5)}
              memberName={memberName}
              setTab={setTab}
              setModal={setModal}
            />
          )}
          {tab === "members" && (
            <MembersScreen
              members={data.members}
              jama={data.jama}
              onAdd={() => setModal("member")}
              onRemove={removeMember}
            />
          )}
          {tab === "jama" && (
            <JamaScreen
              jama={data.jama}
              total={totals.totalJama}
              memberName={memberName}
              onAdd={() => setModal("jama")}
              onRemove={removeJama}
            />
          )}
          {tab === "expense" && (
            <ExpenseScreen
              expenses={data.expenses}
              total={totals.totalExpense}
              onAdd={() => setModal("expense")}
              onRemove={removeExpense}
            />
          )}
          {tab === "transactions" && (
            <TransactionsScreen transactions={transactions} memberName={memberName} balance={totals.balance} />
          )}
        </div>

        <div style={styles.bottomNav}>
          <NavItem icon={<Home size={20} />} label="होम" active={tab === "home"} onClick={() => setTab("home")} />
          <NavItem icon={<Users size={20} />} label="सदस्य" active={tab === "members"} onClick={() => setTab("members")} />
          <NavItem icon={<PiggyBank size={20} />} label="जमा शीट" active={tab === "jama"} onClick={() => setTab("jama")} />
          <NavItem icon={<Receipt size={20} />} label="खर्च शीट" active={tab === "expense"} onClick={() => setTab("expense")} />
          <NavItem icon={<ArrowLeftRight size={20} />} label="लेन-देन" active={tab === "transactions"} onClick={() => setTab("transactions")} />
        </div>

        {toast && <div style={styles.toast}>{toast}</div>}
      </div>

      {modal === "member" && <MemberModal onClose={() => setModal(null)} onSave={addMember} />}
      {modal === "jama" && <JamaModal members={data.members} onClose={() => setModal(null)} onSave={addJama} />}
      {modal === "expense" && <ExpenseModal onClose={() => setModal(null)} onSave={addExpense} />}
    </div>
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

function HomeScreen({ totals, transactions, memberName, setTab, setModal }) {
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

      {/* Quick Actions */}
      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <QuickAction icon={<PiggyBank size={20} color="#4C3F8A" />} label="नई जमा" bg="#F0F4FF" onClick={() => setModal("jama")} />
        <QuickAction icon={<Receipt size={20} color="#D95F5F" />} label="नया खर्च" bg="#FFF0F0" onClick={() => setModal("expense")} />
        <QuickAction icon={<Users size={20} color="#6B59B3" />} label="नया सदस्य" bg="#F3F0FA" onClick={() => setModal("member")} />
      </div>

      {/* Mini Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
        <StatBox label="कुल सदस्य" value={totals.members + " लोग"} tint="#FFFFFF" accent="#1E1638" onClick={() => setTab("members")} />
        <StatBox label="लेन-देन" value={transactions.length + " एंट्री"} tint="#FFFFFF" accent="#1E1638" onClick={() => setTab("transactions")} />
      </div>

      {/* Recent Txns */}
      <div style={{ marginTop: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: "#1E1638", fontFamily: "Hind, sans-serif" }}>हाल की लेन-देन</span>
          <button className="hb-btn" onClick={() => setTab("transactions")} style={styles.linkBtn}>
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

function JamaScreen({ jama, total, memberName, onAdd, onRemove }) {
  const sorted = [...jama].sort((a, b) => new Date(b.date) - new Date(a.date));
  return (
    <div className="hb-fadein" style={{ padding: "18px 16px 24px" }}>
      <ScreenHeader title="जमा शीट" subtitle={`कुल जमा: ${fmt(total)}`} onAdd={onAdd} addLabel="जमा जोड़ें" accent="#4C3F8A" />
      {sorted.length === 0 ? (
        <EmptyNote text="अभी कोई जमा दर्ज नहीं है।" />
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
                  {dispDate(j.date)}{j.note ? ` · ${j.note}` : ""}
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

function TransactionsScreen({ transactions, memberName, balance }) {
  let running = balance;
  const rows = transactions.map((t) => {
    const row = { ...t, runningBalance: running };
    running = t.type === "jama" ? running - t.amount : running + t.amount;
    return row;
  });
  return (
    <div className="hb-fadein" style={{ padding: "18px 16px 24px" }}>
      <ScreenHeader title="लेन-देन" subtitle={`कुल ${transactions.length} एंट्री · पासबुक स्टाइल`} />
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

function ModalShell({ title, onClose, children }) {
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontFamily: "Baloo 2, sans-serif", fontSize: 18, fontWeight: 800, color: "#1E1638" }}>{title}</span>
          <button className="hb-btn" onClick={onClose} style={styles.closeBtn} aria-label="बंद करें">
            <X size={18} color="#7A849C" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function MemberModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const submit = () => {
    if (!name.trim()) return setErr("नाम लिखना ज़रूरी है");
    onSave(name);
    onClose();
  };
  return (
    <ModalShell title="नया सदस्य जोड़ें" onClose={onClose}>
      <label style={styles.label}>सदस्य का नाम</label>
      <input
        style={styles.input}
        value={name}
        onChange={(e) => { setName(e.target.value); setErr(""); }}
        placeholder="जैसे: रमेश कुमार"
        autoFocus
      />
      {err && <div style={styles.errText}>{err}</div>}
      <button className="hb-btn" onClick={submit} style={styles.submitBtn}>जोड़ें</button>
    </ModalShell>
  );
}

function JamaModal({ members, onClose, onSave }) {
  const [memberId, setMemberId] = useState(members[0]?.id || "");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayStr());
  const [note, setNote] = useState("");
  const [err, setErr] = useState("");
  const submit = () => {
    if (!memberId) return setErr("पहले सदस्य जोड़ें");
    if (!amount || Number(amount) <= 0) return setErr("सही राशि डालें");
    onSave({ memberId, amount, date, note });
    onClose();
  };
  return (
    <ModalShell title="जमा दर्ज करें" onClose={onClose}>
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
      <button className="hb-btn" onClick={submit} style={styles.submitBtn}>जमा जोड़ें</button>
    </ModalShell>
  );
}

function ExpenseModal({ onClose, onSave }) {
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
    <ModalShell title="खर्च दर्ज करें" onClose={onClose}>
      <label style={styles.label}>विवरण</label>
      <input style={styles.input} value={desc} onChange={(e) => { setDesc(e.target.value); setErr(""); }} placeholder="जैसे: सजावट का सामान" autoFocus />
      <label style={styles.label}>राशि (₹)</label>
      <input style={styles.input} type="number" value={amount} onChange={(e) => { setAmount(e.target.value); setErr(""); }} placeholder="जैसे: 1200" />
      <label style={styles.label}>तारीख</label>
      <input style={styles.input} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      {err && <div style={styles.errText}>{err}</div>}
      <button className="hb-btn" onClick={submit} style={styles.submitBtn}>खर्च जोड़ें</button>
    </ModalShell>
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
  closeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 4,
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    zIndex: 50,
  },
  modalCard: {
    width: "100%",
    maxWidth: "1080px",
    background: "#FFFFFF",
    borderRadius: "24px 24px 0 0",
    padding: "24px 20px 30px",
    boxShadow: "0 -4px 20px rgba(0,0,0,0.1)",
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
    marginTop: 22,
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
