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

const AVATAR_COLORS = ["#534AB7", "#7F77DD", "#9B59D0", "#6D4FC7", "#8B5FBF", "#4C3F8A"];
const colorFor = (str) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
};

export default function HisaabApp() {
  const [data, setData] = useState({ members: [], jama: [], expenses: [] });
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("home");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    try {
      const res = localStorage.getItem(STORAGE_KEY);
      if (res) setData(JSON.parse(res));
    } catch (e) {
      /* no existing data yet */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
  }, [data, loaded]);

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

  const ringPct = totals.totalJama > 0 ? Math.min(100, Math.round((totals.balance / totals.totalJama) * 100)) : 0;
  const circumference = 2 * Math.PI * 52;
  const ringOffset = circumference - (Math.max(0, ringPct) / 100) * circumference;

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
        <div style={styles.statusBar}>
          <span style={{ fontWeight: 800 }}>9:41</span>
          <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 11 }}>५G</span>
            <span>🔋</span>
          </span>
        </div>

        <div className="hb-scroll" style={styles.screen}>
          {tab === "home" && (
            <HomeScreen
              totals={totals}
              transactions={transactions.slice(0, 5)}
              memberName={memberName}
              ringOffset={ringOffset}
              circumference={circumference}
              setTab={setTab}
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
        color: active ? "#A78BFA" : "#8E7FBE",
        cursor: "pointer",
        flex: 1,
        padding: "6px 0",
      }}
    >
      {icon}
      <span style={{ fontSize: 10.5, fontFamily: "Hind, sans-serif", fontWeight: active ? 600 : 500 }}>{label}</span>
    </button>
  );
}

function HomeScreen({ totals, transactions, memberName, ringOffset, circumference, setTab }) {
  return (
    <div className="hb-fadein" style={{ padding: "18px 16px 12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <div style={{ fontFamily: "Baloo 2, sans-serif", fontSize: 21, fontWeight: 800, color: "#EFEAFB" }}>हिसाब</div>
          <div style={{ fontSize: 12, color: "#8E7FBE", fontFamily: "Hind, sans-serif" }}>आपका ग्रुप, आपका हिसाब</div>
        </div>
        <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#382C63", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #4C3F8A" }}>
          <Users size={17} color="#A78BFA" />
        </div>
      </div>

      <div style={styles.heroCard}>
        <div style={{ position: "relative", width: 118, height: 118, margin: "0 auto" }}>
          <svg width="118" height="118" viewBox="0 0 118 118">
            <circle cx="59" cy="59" r="52" fill="none" stroke="#4C3F8A" strokeWidth="9" />
            <circle
              cx="59"
              cy="59"
              r="52"
              fill="none"
              stroke="#A78BFA"
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={ringOffset}
              transform="rotate(-90 59 59)"
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 9.5, color: "#B7A9E0", fontFamily: "Hind, sans-serif" }}>बैलेंस</span>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 15, fontWeight: 800, color: "#EFEAFB" }}>{fmt(totals.balance)}</span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-around", marginTop: 16, paddingTop: 14, borderTop: "1px solid #4C3F8A" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#B7A9E0", fontFamily: "Hind, sans-serif" }}>कुल जमा</div>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13.5, fontWeight: 800, color: "#C4B5FD" }}>{fmt(totals.totalJama)}</div>
          </div>
          <div style={{ width: 1, background: "#4C3F8A" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#B7A9E0", fontFamily: "Hind, sans-serif" }}>कुल खर्च</div>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13.5, fontWeight: 800, color: "#E4877F" }}>{fmt(totals.totalExpense)}</div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
        <StatBox label="कुल जमा" value={fmt(totals.totalJama)} tint="#332764" accent="#C4B5FD" onClick={() => setTab("jama")} />
        <StatBox label="कुल खर्च" value={fmt(totals.totalExpense)} tint="#3D2350" accent="#E4877F" onClick={() => setTab("expense")} />
        <StatBox label="कुल सदस्य" value={totals.members} tint="#382C63" accent="#A78BFA" onClick={() => setTab("members")} />
        <StatBox label="बैलेंस" value={fmt(totals.balance)} tint="#382C63" accent="#EFEAFB" onClick={() => setTab("transactions")} />
      </div>

      <div style={{ marginTop: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 13.5, fontWeight: 800, color: "#EFEAFB", fontFamily: "Hind, sans-serif" }}>हाल की लेन-देन</span>
          <button className="hb-btn" onClick={() => setTab("transactions")} style={styles.linkBtn}>
            सभी देखें <ChevronRight size={13} />
          </button>
        </div>
        {transactions.length === 0 ? (
          <EmptyNote text="अभी कोई लेन-देन नहीं है। जमा या खर्च जोड़ें।" />
        ) : (
          transactions.map((t) => (
            <TxnRow key={t.id} t={t} memberName={memberName} />
          ))
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value, tint, accent, onClick }) {
  return (
    <button className="hb-card hb-btn" onClick={onClick} style={{ ...styles.statBox, background: tint, cursor: "pointer" }}>
      <div style={{ fontSize: 11, color: "#B7A9E0", fontFamily: "Hind, sans-serif", marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 16, fontWeight: 800, color: accent }}>{value}</div>
    </button>
  );
}

function TxnRow({ t, memberName }) {
  const isJama = t.type === "jama";
  return (
    <div style={styles.txnRow}>
      <div style={{ ...styles.txnIcon, background: isJama ? "#332764" : "#3D2350" }}>
        {isJama ? <PiggyBank size={15} color="#C4B5FD" /> : <Receipt size={15} color="#E4877F" />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: "#EFEAFB", fontFamily: "Hind, sans-serif", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {isJama ? memberName(t.memberId) : t.desc}
        </div>
        <div style={{ fontSize: 10.5, color: "#8E7FBE", fontFamily: "Hind, sans-serif" }}>{dispDate(t.date)}</div>
      </div>
      <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13, fontWeight: 800, color: isJama ? "#C4B5FD" : "#E4877F" }}>
        {isJama ? "+" : "-"}{fmt(t.amount)}
      </div>
    </div>
  );
}

function MembersScreen({ members, jama, onAdd, onRemove }) {
  const memberTotal = (id) => jama.filter((j) => j.memberId === id).reduce((s, j) => s + Number(j.amount), 0);
  return (
    <div className="hb-fadein" style={{ padding: "18px 16px" }}>
      <ScreenHeader title="सदस्य" subtitle={`${members.length} सदस्य जुड़े हैं`} onAdd={onAdd} addLabel="सदस्य जोड़ें" />
      {members.length === 0 ? (
        <EmptyNote text="कोई सदस्य नहीं है। नया सदस्य जोड़ें।" />
      ) : (
        members.map((m) => (
          <div key={m.id} style={styles.listRow}>
            <div style={{ ...styles.avatar, background: colorFor(m.name) }}>{m.name.trim().slice(0, 1).toUpperCase()}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, color: "#EFEAFB", fontFamily: "Hind, sans-serif", fontWeight: 700 }}>{m.name}</div>
              <div style={{ fontSize: 11, color: "#8E7FBE", fontFamily: "Hind, sans-serif" }}>कुल जमा: {fmt(memberTotal(m.id))}</div>
            </div>
            <button className="hb-btn" onClick={() => onRemove(m.id)} style={styles.trashBtn} aria-label="हटाएं">
              <Trash2 size={15} color="#E4877F" />
            </button>
          </div>
        ))
      )}
    </div>
  );
}

function JamaScreen({ jama, total, memberName, onAdd, onRemove }) {
  const sorted = [...jama].sort((a, b) => new Date(b.date) - new Date(a.date));
  return (
    <div className="hb-fadein" style={{ padding: "18px 16px" }}>
      <ScreenHeader title="जमा शीट" subtitle={`कुल जमा: ${fmt(total)}`} onAdd={onAdd} addLabel="जमा जोड़ें" accent="#C4B5FD" />
      {sorted.length === 0 ? (
        <EmptyNote text="अभी कोई जमा दर्ज नहीं है।" />
      ) : (
        sorted.map((j) => (
          <div key={j.id} style={styles.listRow}>
            <div style={{ ...styles.avatar, background: colorFor(memberName(j.memberId)) }}>
              {memberName(j.memberId).trim().slice(0, 1).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, color: "#EFEAFB", fontFamily: "Hind, sans-serif", fontWeight: 700 }}>{memberName(j.memberId)}</div>
              <div style={{ fontSize: 11, color: "#8E7FBE", fontFamily: "Hind, sans-serif" }}>
                {dispDate(j.date)}{j.note ? ` · ${j.note}` : ""}
              </div>
            </div>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13.5, fontWeight: 800, color: "#C4B5FD", marginRight: 8 }}>
              +{fmt(j.amount)}
            </div>
            <button className="hb-btn" onClick={() => onRemove(j.id)} style={styles.trashBtn} aria-label="हटाएं">
              <Trash2 size={14} color="#8E7FBE" />
            </button>
          </div>
        ))
      )}
    </div>
  );
}

function ExpenseScreen({ expenses, total, onAdd, onRemove }) {
  const sorted = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
  return (
    <div className="hb-fadein" style={{ padding: "18px 16px" }}>
      <ScreenHeader title="खर्च शीट" subtitle={`कुल खर्च: ${fmt(total)}`} onAdd={onAdd} addLabel="खर्च जोड़ें" accent="#E4877F" />
      {sorted.length === 0 ? (
        <EmptyNote text="अभी कोई खर्च दर्ज नहीं है।" />
      ) : (
        sorted.map((e) => (
          <div key={e.id} style={styles.listRow}>
            <div style={{ ...styles.avatar, background: "#3D2350" }}>
              <Receipt size={15} color="#E4877F" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, color: "#EFEAFB", fontFamily: "Hind, sans-serif", fontWeight: 700 }}>{e.desc}</div>
              <div style={{ fontSize: 11, color: "#8E7FBE", fontFamily: "Hind, sans-serif" }}>{dispDate(e.date)}</div>
            </div>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13.5, fontWeight: 800, color: "#E4877F", marginRight: 8 }}>
              -{fmt(e.amount)}
            </div>
            <button className="hb-btn" onClick={() => onRemove(e.id)} style={styles.trashBtn} aria-label="हटाएं">
              <Trash2 size={14} color="#8E7FBE" />
            </button>
          </div>
        ))
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
    <div className="hb-fadein" style={{ padding: "18px 16px" }}>
      <ScreenHeader title="लेन-देन" subtitle={`कुल ${transactions.length} एंट्री · पासबुक स्टाइल`} />
      {rows.length === 0 ? (
        <EmptyNote text="अभी कोई लेन-देन नहीं है।" />
      ) : (
        rows.map((t) => (
          <div key={t.id} style={styles.txnRow}>
            <div style={{ ...styles.txnIcon, background: t.type === "jama" ? "#332764" : "#3D2350" }}>
              {t.type === "jama" ? <PiggyBank size={15} color="#C4B5FD" /> : <Receipt size={15} color="#E4877F" />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: "#EFEAFB", fontFamily: "Hind, sans-serif", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {t.type === "jama" ? memberName(t.memberId) : t.desc}
              </div>
              <div style={{ fontSize: 10.5, color: "#8E7FBE", fontFamily: "Hind, sans-serif" }}>{dispDate(t.date)}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13, fontWeight: 800, color: t.type === "jama" ? "#C4B5FD" : "#E4877F" }}>
                {t.type === "jama" ? "+" : "-"}{fmt(t.amount)}
              </div>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#8E7FBE" }}>शेष {fmt(t.runningBalance)}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function ScreenHeader({ title, subtitle, onAdd, addLabel, accent = "#A78BFA" }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
      <div>
        <div style={{ fontFamily: "Baloo 2, sans-serif", fontSize: 19, fontWeight: 800, color: "#EFEAFB" }}>{title}</div>
        <div style={{ fontSize: 12, color: "#B7A9E0", fontFamily: "Hind, sans-serif", marginTop: 2 }}>{subtitle}</div>
      </div>
      {onAdd && (
        <button className="hb-btn" onClick={onAdd} style={{ ...styles.addBtn, background: accent }}>
          <Plus size={15} color="#1E1638" />
        </button>
      )}
    </div>
  );
}

function EmptyNote({ text }) {
  return (
    <div style={{ textAlign: "center", padding: "36px 12px", color: "#8E7FBE", fontSize: 12.5, fontFamily: "Hind, sans-serif" }}>
      {text}
    </div>
  );
}

function ModalShell({ title, onClose, children }) {
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontFamily: "Baloo 2, sans-serif", fontSize: 16, fontWeight: 800, color: "#EFEAFB" }}>{title}</span>
          <button className="hb-btn" onClick={onClose} style={styles.closeBtn} aria-label="बंद करें">
            <X size={16} color="#B7A9E0" />
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
    background: "#1E1638",
    fontFamily: "Hind, sans-serif",
    overflow: "hidden",
  },
  phoneFrame: {
    width: "100%",
    height: "100%",
    maxWidth: "1080px", // Optional, keeps it readable if viewed on a very wide screen
    background: "#1E1638",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  statusBar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 22px 4px",
    fontSize: 12,
    color: "#EFEAFB",
    fontFamily: "Hind, sans-serif",
  },
  screen: {
    flex: 1,
    overflowY: "auto",
  },
  bottomNav: {
    display: "flex",
    background: "#241D42",
    borderTop: "1px solid #382C63",
    padding: "6px 4px 10px",
  },
  heroCard: {
    background: "#2B2354",
    border: "1px solid #4C3F8A",
    borderRadius: 16,
    padding: "18px 16px",
  },
  statBox: {
    border: "none",
    borderRadius: 12,
    padding: "12px 14px",
    textAlign: "left",
    display: "block",
    width: "100%",
  },
  linkBtn: {
    background: "none",
    border: "none",
    color: "#A78BFA",
    fontSize: 11.5,
    fontFamily: "Hind, sans-serif",
    display: "flex",
    alignItems: "center",
    gap: 2,
    cursor: "pointer",
    padding: 0,
  },
  txnRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 0",
    borderBottom: "1px solid #382C63",
  },
  txnIcon: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  listRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 0",
    borderBottom: "1px solid #382C63",
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#EFEAFB",
    fontSize: 13,
    fontWeight: 800,
    flexShrink: 0,
    fontFamily: "Hind, sans-serif",
  },
  trashBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 6,
    flexShrink: 0,
  },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
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
    background: "#2B2354",
    borderRadius: "20px 20px 0 0",
    border: "1px solid #4C3F8A",
    borderBottom: "none",
    padding: "20px 18px 26px",
  },
  label: {
    display: "block",
    fontSize: 11.5,
    color: "#B7A9E0",
    fontFamily: "Hind, sans-serif",
    marginBottom: 5,
    marginTop: 12,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    background: "#1E1638",
    border: "1px solid #4C3F8A",
    borderRadius: 10,
    padding: "10px 12px",
    color: "#EFEAFB",
    fontSize: 13.5,
    outline: "none",
  },
  errText: {
    color: "#E4877F",
    fontSize: 11.5,
    fontFamily: "Hind, sans-serif",
    marginTop: 6,
  },
  submitBtn: {
    width: "100%",
    background: "#A78BFA",
    color: "#1E1638",
    border: "none",
    borderRadius: 10,
    padding: "12px 0",
    fontSize: 14,
    fontWeight: 800,
    marginTop: 18,
    cursor: "pointer",
    fontFamily: "Hind, sans-serif",
  },
  toast: {
    position: "absolute",
    bottom: 78,
    left: "50%",
    transform: "translateX(-50%)",
    background: "#EFEAFB",
    color: "#2B2354",
    padding: "8px 16px",
    borderRadius: 20,
    fontSize: 12,
    fontFamily: "Hind, sans-serif",
    fontWeight: 700,
    boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
    zIndex: 60,
  },
};
