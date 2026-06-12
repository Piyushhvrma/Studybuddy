import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  RiUserLine, RiFireLine, RiTrophyLine, RiStickyNoteLine,
  RiBookOpenLine, RiCalendarCheckLine, RiEditLine, RiCheckLine,
  RiCloseLine, RiCamera2Line
} from "react-icons/ri";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [stats, setStats] = useState({ totalNotes: 0, totalMaterials: 0, totalEntries: 0 });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setStats({ totalNotes: res.data.totalNotes, totalMaterials: res.data.totalMaterials, totalEntries: res.data.totalEntries });
        setName(res.data.user.name);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveName = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const res = await updateProfile({ name });
      updateUser({ name: res.data.user.name });
      setEditing(false);
    } catch {
      setError("Failed to update name.");
    } finally {
      setSaving(false);
    }
  };

  const statsGrid = [
    { label: "Current Streak", value: user?.currentStreak || 0, icon: RiFireLine, color: "text-orange-400", bg: "bg-orange-400/10" },
    { label: "Longest Streak", value: user?.longestStreak || 0, icon: RiTrophyLine, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { label: "Total Notes", value: stats.totalNotes, icon: RiStickyNoteLine, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Materials", value: stats.totalMaterials, icon: RiBookOpenLine, color: "text-purple-400", bg: "bg-purple-400/10" },
    { label: "Learning Entries", value: stats.totalEntries, icon: RiCalendarCheckLine, color: "text-green-400", bg: "bg-green-400/10" },
  ];

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse space-y-6">
        <div className="h-40 bg-surface-hover rounded-2xl" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-surface-hover rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in space-y-8">
      {/* Profile Card */}
      <div className="glass-card p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-indigo flex items-center justify-center shadow-glow text-white text-3xl font-bold shrink-0">
              {user?.profilePic ? (
                <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                user?.name?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-surface rounded-lg border border-surface-border flex items-center justify-center cursor-pointer hover:border-accent-purple/50 transition-all">
              <RiCamera2Line className="text-white/50 text-sm" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
              {editing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="input-field text-xl font-bold py-1"
                    autoFocus
                  />
                  <button onClick={handleSaveName} disabled={saving} className="p-2 rounded-lg bg-accent-purple/20 hover:bg-accent-purple/30 text-accent-glow transition-all">
                    <RiCheckLine />
                  </button>
                  <button onClick={() => setEditing(false)} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-all">
                    <RiCloseLine />
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
                  <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/70 transition-all">
                    <RiEditLine />
                  </button>
                </>
              )}
            </div>
            {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
            <p className="text-white/50 mt-1">{user?.email}</p>
            <div className="flex items-center gap-2 mt-3 justify-center md:justify-start">
              <span className="badge bg-accent-purple/10 text-accent-glow border border-accent-purple/20">
                <RiUserLine className="text-xs" /> Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Your Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statsGrid.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="stat-card text-center group">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className={`${color} text-lg`} />
              </div>
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-white/40 text-xs mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Streak Visual */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Streak Progress</h2>
        <div className="flex items-center gap-1 flex-wrap">
          {[...Array(30)].map((_, i) => {
            const isActive = i < (user?.currentStreak || 0);
            return (
              <div key={i} className={`w-6 h-6 rounded transition-all duration-200 ${isActive ? "bg-orange-500 shadow-sm" : "bg-surface-hover border border-surface-border"}`} />
            );
          })}
          <span className="text-white/30 text-xs ml-2">30-day view</span>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-orange-500" />
            <span className="text-white/40 text-xs">Active day</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-surface-hover border border-surface-border" />
            <span className="text-white/40 text-xs">Inactive</span>
          </div>
        </div>
      </div>
    </div>
  );
}
