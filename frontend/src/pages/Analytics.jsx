import { useEffect, useState } from "react";
import { getAnalyticsOverview } from "../services/api";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  RiBarChartBoxLine, RiFireLine, RiStickyNoteLine, RiBookOpenLine,
  RiFolderLine, RiCalendarCheckLine, RiPieChartLine, RiLineChartLine
} from "react-icons/ri";

const COLORS = ["#7c3aed", "#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#3730a3"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-700 border border-surface-border rounded-lg px-3 py-2 shadow-card">
        <p className="text-white/60 text-xs mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-white text-sm font-semibold" style={{ color: p.color || p.fill }}>
            {p.value} {p.name === "count" ? "entries" : ""}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAnalyticsOverview();
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="h-8 bg-surface-hover rounded w-64 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => <div key={i} className="h-24 bg-surface-hover rounded-xl animate-pulse" />)}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-72 bg-surface-hover rounded-xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  const { dailyActivity, notesByFolder, entriesByWeekday, materialsByType, monthlyTrend, summary } = data;

  const formattedDaily = dailyActivity.map((d) => {
    const date = new Date(d._id + "T00:00:00");
    return { name: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }), count: d.count };
  });

  const summaryCards = [
    { label: "Total Entries", value: summary.totalEntries, icon: RiCalendarCheckLine, color: "from-green-500 to-emerald-500" },
    { label: "Active Days", value: summary.activeDays, icon: RiFireLine, color: "from-orange-500 to-red-500" },
    { label: "Avg / Active Day", value: summary.avgPerActiveDay, icon: RiBarChartBoxLine, color: "from-blue-500 to-cyan-500" },
    { label: "Total Notes", value: summary.totalNotes, icon: RiStickyNoteLine, color: "from-purple-500 to-pink-500" },
    { label: "Materials", value: summary.totalMaterials, icon: RiBookOpenLine, color: "from-yellow-500 to-orange-500" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="page-title flex items-center gap-2">
          <RiBarChartBoxLine className="text-accent-glow" />
          Analytics
        </h1>
        <p className="page-subtitle">Visualize your learning progress and consistency</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {summaryCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card group">
            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${color} bg-opacity-20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
              <Icon className="text-white text-base" />
            </div>
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-white/40 text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-6 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <RiLineChartLine className="text-accent-glow text-lg" />
            <h2 className="text-white font-semibold">Daily Activity (Last 30 Days)</h2>
          </div>
          {formattedDaily.length === 0 ? (
            <EmptyChart message="No activity logged yet. Start tracking your daily learning!" />
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={formattedDaily}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
                <XAxis dataKey="name" stroke="#ffffff40" fontSize={11} />
                <YAxis stroke="#ffffff40" fontSize={11} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="count" stroke="#a78bfa" strokeWidth={2.5} dot={{ fill: "#7c3aed", r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <RiBarChartBoxLine className="text-accent-glow text-lg" />
            <h2 className="text-white font-semibold">Monthly Trend</h2>
          </div>
          {monthlyTrend.length === 0 ? (
            <EmptyChart message="No data for the last 6 months yet." />
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
                <XAxis dataKey="name" stroke="#ffffff40" fontSize={11} />
                <YAxis stroke="#ffffff40" fontSize={11} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#7c3aed" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <RiCalendarCheckLine className="text-accent-glow text-lg" />
            <h2 className="text-white font-semibold">Most Productive Days</h2>
          </div>
          {summary.totalEntries === 0 ? (
            <EmptyChart message="Log entries to see your weekly pattern." />
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={entriesByWeekday}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
                <XAxis dataKey="name" stroke="#ffffff40" fontSize={11} />
                <YAxis stroke="#ffffff40" fontSize={11} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {entriesByWeekday.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <RiPieChartLine className="text-accent-glow text-lg" />
            <h2 className="text-white font-semibold">Notes by Folder</h2>
          </div>
          {notesByFolder.length === 0 || notesByFolder.every(f => f.value === 0) ? (
            <EmptyChart message="Create folders and notes to see distribution." icon={RiFolderLine} />
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={notesByFolder.filter(f => f.value > 0)}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {notesByFolder.filter(f => f.value > 0).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "12px", color: "#ffffff80" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <RiBookOpenLine className="text-accent-glow text-lg" />
            <h2 className="text-white font-semibold">Materials by Type</h2>
          </div>
          {materialsByType.length === 0 ? (
            <EmptyChart message="Upload study materials to see breakdown." icon={RiBookOpenLine} />
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={materialsByType}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {materialsByType.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "12px", color: "#ffffff80" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyChart({ message, icon: Icon = RiBarChartBoxLine }) {
  return (
    <div className="flex flex-col items-center justify-center h-[250px] text-center">
      <Icon className="text-3xl text-white/20 mb-2" />
      <p className="text-white/40 text-sm max-w-xs">{message}</p>
    </div>
  );
}