import { useEffect, useState } from "react";
import { getAllEntries, createEntry, updateEntry, deleteEntry } from "../services/api";
import {
  RiCalendarCheckLine, RiAddLine, RiEditLine, RiDeleteBinLine,
  RiFireLine, RiTrophyLine, RiCloseLine, RiCheckLine
} from "react-icons/ri";

const today = new Date().toISOString().split("T")[0];

const EntryModal = ({ entry, onClose, onSave }) => {
  const [form, setForm] = useState({
    title: entry?.title || "",
    description: entry?.description || "",
    date: entry?.date || today,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (entry?._id) {
        const res = await updateEntry(entry._id, form);
        onSave(res.data.entry, "update");
      } else {
        const res = await createEntry(form);
        onSave(res.data.entry, "create");
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">{entry?._id ? "Edit Entry" : "New Learning Entry"}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white"><RiCloseLine className="text-xl" /></button>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3 py-2.5 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Completed Binary Search"
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="label">What did you learn?</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe what you learned today..."
              className="textarea-field"
              rows={4}
              required
            />
          </div>
          <div>
            <label className="label">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="input-field"
              max={today}
              required
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</span> : <><RiCheckLine className="inline" /> Save Entry</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function Tracker() {
  const [entries, setEntries] = useState([]);
  const [streak, setStreak] = useState({ current: 0, longest: 0 });
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, entry: null });

  const fetchEntries = async () => {
    try {
      const res = await getAllEntries();
      setEntries(res.data.entries);
      setStreak({ current: res.data.currentStreak, longest: res.data.longestStreak });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEntries(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this entry?")) return;
    await deleteEntry(id);
    setEntries(entries.filter((e) => e._id !== id));
  };

  const handleSave = (entry, type) => {
    if (type === "create") {
      setEntries([entry, ...entries]);
      setStreak(s => ({ ...s, current: s.current + 1 }));
    } else {
      setEntries(entries.map((e) => (e._id === entry._id ? entry : e)));
    }
  };

  // Group entries by date
  const grouped = entries.reduce((acc, entry) => {
    if (!acc[entry.date]) acc[entry.date] = [];
    acc[entry.date].push(entry);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="page-title">Daily Tracker</h1>
          <p className="page-subtitle">Log what you learn every day</p>
        </div>
        <button onClick={() => setModal({ open: true, entry: null })} className="btn-primary flex items-center gap-2">
          <RiAddLine /> Add Entry
        </button>
      </div>

      {/* Streak Banner */}
      <div className="glass-card p-5 mb-8 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
            <RiFireLine className="text-orange-400 text-2xl" />
          </div>
          <div>
            <p className="text-white/50 text-sm">Current Streak</p>
            <p className="text-2xl font-bold text-white">{streak.current} <span className="text-sm font-normal text-white/50">days</span></p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
            <RiTrophyLine className="text-yellow-400 text-2xl" />
          </div>
          <div>
            <p className="text-white/50 text-sm">Longest Streak</p>
            <p className="text-2xl font-bold text-white">{streak.longest} <span className="text-sm font-normal text-white/50">days</span></p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2">
          {[...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            const key = d.toISOString().split("T")[0];
            const done = !!grouped[key];
            return (
              <div key={i} title={key} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all
                ${done ? "bg-green-500/30 text-green-400 border border-green-500/40" : "bg-surface-hover text-white/20 border border-surface-border"}`}>
                {done ? "✓" : d.getDate()}
              </div>
            );
          })}
          <span className="text-white/30 text-xs ml-2">Last 7 days</span>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-surface-hover rounded-xl animate-pulse" />)}
        </div>
      ) : entries.length === 0 ? (
        <div className="empty-state glass-card">
          <RiCalendarCheckLine className="text-5xl text-white/20 mb-4" />
          <h3 className="text-white font-medium text-lg mb-1">No entries yet</h3>
          <p className="text-white/40 text-sm mb-5">Log what you learn today to start your streak!</p>
          <button onClick={() => setModal({ open: true, entry: null })} className="btn-primary flex items-center gap-2">
            <RiAddLine /> Add First Entry
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([date, dayEntries]) => (
              <div key={date}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-semibold text-accent-glow uppercase tracking-widest">{date === today ? "Today" : date}</span>
                  <div className="flex-1 h-px bg-surface-border" />
                  <span className="badge bg-green-500/10 text-green-400 border border-green-500/20">{dayEntries.length} {dayEntries.length === 1 ? "entry" : "entries"}</span>
                </div>
                <div className="space-y-3">
                  {dayEntries.map((entry) => (
                    <div key={entry._id} className="glass-card p-5 group flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-accent-purple mt-2 shrink-0 group-hover:scale-150 transition-transform" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold group-hover:text-accent-glow transition-colors">{entry.title}</h3>
                        <p className="text-white/50 text-sm mt-1 leading-relaxed">{entry.description}</p>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button onClick={() => setModal({ open: true, entry })} className="p-2 rounded-lg hover:bg-accent-purple/20 text-white/40 hover:text-accent-glow transition-all">
                          <RiEditLine />
                        </button>
                        <button onClick={() => handleDelete(entry._id)} className="p-2 rounded-lg hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all">
                          <RiDeleteBinLine />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {modal.open && (
        <EntryModal
          entry={modal.entry}
          onClose={() => setModal({ open: false, entry: null })}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
