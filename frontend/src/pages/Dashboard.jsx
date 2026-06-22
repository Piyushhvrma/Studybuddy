import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProfile, getAllEntries } from "../services/api";
import {
  RiFireLine, RiStickyNoteLine, RiBookOpenLine, RiCalendarCheckLine,
  RiArrowRightLine, RiTrophyLine, RiFlashlightLine,
  RiTeamLine, RiChat3Line, RiBrushLine
} from "react-icons/ri";

const QUOTES = [
  "Small progress every day adds up to big results.",
  "Consistency beats motivation every time.",
  "Show up even when you don't feel like it.",
  "The secret to getting ahead is getting started.",
  "Don't count the days. Make the days count.",
  "You don't rise to the level of your goals — you fall to the level of your systems.",
  "Discipline is choosing between what you want now and what you want most.",
  "Every expert was once a beginner.",
];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalNotes: 0, totalMaterials: 0, totalEntries: 0, currentStreak: 0, longestStreak: 0 });
  const [recentEntries, setRecentEntries] = useState([]);
  const [quote] = useState(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, entriesRes] = await Promise.all([
          getProfile(),
          getAllEntries(),
        ]);
        const { totalNotes, totalMaterials, totalEntries, user: u } = profileRes.data;
        setStats({
          totalNotes,
          totalMaterials,
          totalEntries,
          currentStreak: u.currentStreak,
          longestStreak: u.longestStreak,
        });
        setRecentEntries(entriesRes.data.entries.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: "Current Streak", value: stats.currentStreak, unit: "days", icon: RiFireLine, color: "from-orange-500 to-red-500", glow: "orange" },
    { label: "Total Notes", value: stats.totalNotes, unit: "notes", icon: RiStickyNoteLine, color: "from-blue-500 to-cyan-500", glow: "blue" },
    { label: "Materials", value: stats.totalMaterials, unit: "files", icon: RiBookOpenLine, color: "from-purple-500 to-pink-500", glow: "purple" },
    { label: "Learning Entries", value: stats.totalEntries, unit: "entries", icon: RiCalendarCheckLine, color: "from-green-500 to-emerald-500", glow: "green" },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-surface-hover rounded w-64" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-surface-hover rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Welcome back, <span className="text-accent-glow">{user?.name?.split(" ")[0]}</span>. 👋
        </h1>
        <p className="text-white/40 mt-1">Here's your progress overview.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(({ label, value, unit, icon: Icon, color }) => (
          <div key={label} className="stat-card group">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} bg-opacity-20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="text-white text-lg" />
            </div>
            <div className="text-3xl font-bold text-white">{value}</div>
            <div className="text-white/40 text-xs mt-0.5">{unit}</div>
            <div className="text-white/60 text-sm font-medium mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Collaborative Study Room Feature */}
<div className="glass-card p-6 md:p-8 relative overflow-hidden border-accent-purple/30">
  <div className="absolute top-0 right-0 w-72 h-72 bg-accent-purple/10 rounded-full blur-3xl pointer-events-none" />
  <div className="absolute bottom-0 left-0 w-52 h-52 bg-accent-indigo/10 rounded-full blur-3xl pointer-events-none" />

  <div className="relative grid md:grid-cols-[1.4fr_1fr] gap-6 items-center">
    <div>
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-glow text-xs font-semibold mb-4">
        <RiTeamLine />
        New Collaborative Feature
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
        Study together in realtime
      </h2>

      <p className="text-white/50 leading-relaxed mb-6 max-w-2xl">
        Create a private study room, invite friends using a room code,
        discuss through realtime chat, and explain concepts on a shared whiteboard.
      </p>

      <div className="flex flex-wrap gap-3 mb-6">
        <span className="badge bg-white/5 text-white/60 border border-white/10">
          <RiChat3Line className="text-accent-glow" />
          Realtime Chat
        </span>
        <span className="badge bg-white/5 text-white/60 border border-white/10">
          <RiBrushLine className="text-accent-glow" />
          Shared Whiteboard
        </span>
        <span className="badge bg-white/5 text-white/60 border border-white/10">
          <RiTeamLine className="text-accent-glow" />
          Group Study
        </span>
      </div>

      <Link to="/rooms" className="btn-primary inline-flex items-center gap-2">
        Open Study Rooms
        <RiArrowRightLine />
      </Link>
    </div>

    <div className="hidden md:block">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-glow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>

        <div className="h-32 rounded-xl bg-white mb-4 relative overflow-hidden">
          <div className="absolute left-6 top-8 w-28 h-1 bg-accent-purple rotate-12 rounded-full" />
          <div className="absolute left-20 top-16 w-36 h-1 bg-accent-indigo -rotate-6 rounded-full" />
          <div className="absolute right-10 top-10 w-16 h-16 border-4 border-accent-purple rounded-full" />
          <p className="absolute bottom-3 left-4 text-black/40 text-xs font-mono">
            Whiteboard
          </p>
        </div>

        <div className="space-y-2">
          <div className="bg-accent-purple/20 rounded-lg p-2 text-sm text-white/80">
            Piyush: Explain binary search?
          </div>
          <div className="bg-white/5 rounded-lg p-2 text-sm text-white/60">
            Friend: Draw it on board 👆
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Motivational Quote */}
        <div className="md:col-span-2 glass-card p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-accent-purple/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-purple/20 flex items-center justify-center shrink-0">
              <RiFlashlightLine className="text-accent-glow text-lg" />
            </div>
            <div>
              <p className="text-xs text-accent-glow font-semibold uppercase tracking-widest mb-2">Daily Motivation</p>
              <p className="text-white/80 text-lg font-medium leading-relaxed italic">"{quote}"</p>
            </div>
          </div>
        </div>

        {/* Streak Card */}
        <div className="glass-card p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 pointer-events-none" />
          <p className="text-xs text-white/40 font-semibold uppercase tracking-widest mb-3">Streak Status</p>
          <div className="flex items-center gap-3 mb-4">
            <RiFireLine className="text-4xl text-orange-400" />
            <div>
              <div className="text-4xl font-bold text-white">{stats.currentStreak}</div>
              <div className="text-white/40 text-xs">day streak</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <RiTrophyLine className="text-yellow-400" />
            <span className="text-white/60">Best: <span className="text-yellow-400 font-semibold">{stats.longestStreak} days</span></span>
          </div>
          <Link to="/tracker" className="mt-4 flex items-center gap-1 text-xs text-accent-glow hover:text-white transition-colors">
            Log today's entry <RiArrowRightLine />
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="section-header">
          <div>
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
            <p className="text-white/40 text-sm">Your last learning entries</p>
          </div>
          <Link to="/tracker" className="btn-secondary text-sm py-2">
            View All <RiArrowRightLine className="inline ml-1" />
          </Link>
        </div>

        {recentEntries.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <RiCalendarCheckLine className="text-4xl text-white/20 mx-auto mb-3" />
            <p className="text-white/50">No entries yet. Start logging your learning!</p>
            <Link to="/tracker" className="btn-primary mt-4 inline-flex items-center gap-2">
              Add First Entry
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {recentEntries.map((entry) => (
              <div key={entry._id} className="glass-card p-5 group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate group-hover:text-accent-glow transition-colors">{entry.title}</h3>
                    <p className="text-white/40 text-sm mt-1 line-clamp-2">{entry.description}</p>
                  </div>
                  <span className="badge bg-accent-purple/10 text-accent-glow border border-accent-purple/20 shrink-0 text-xs">
                    {entry.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { to: "/tracker", label: "Log Learning", icon: RiCalendarCheckLine, color: "text-green-400" },
            { to: "/notes", label: "Create Note", icon: RiStickyNoteLine, color: "text-blue-400" },
            { to: "/materials", label: "Upload File", icon: RiBookOpenLine, color: "text-purple-400" },
            { to: "/ai", label: "Ask AI", icon: RiFlashlightLine, color: "text-yellow-400" },
          ].map(({ to, label, icon: Icon, color }) => (
            <Link
              key={to}
              to={to}
              className="glass-card p-4 flex flex-col items-center gap-2 text-center group hover:border-accent-purple/50"
            >
              <Icon className={`text-2xl ${color} group-hover:scale-110 transition-transform duration-200`} />
              <span className="text-sm text-white/70 group-hover:text-white transition-colors">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
