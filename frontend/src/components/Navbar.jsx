import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  RiDashboardLine,
  RiCalendarCheckLine,
  RiStickyNoteLine,
  RiBookOpenLine,
  RiLogoutBoxLine,
  RiFlashlightLine,
  RiMenuLine,
  RiCloseLine,
  RiTeamLine,
  RiArrowDownSLine,
  RiRobot2Line,
  RiUserLine,
  RiBarChartBoxLine,
} from "react-icons/ri";
import { useState } from "react";

const mainNavItems = [
  { path: "/dashboard", label: "Dashboard", icon: RiDashboardLine },
  { path: "/tracker", label: "Tracker", icon: RiCalendarCheckLine },
  { path: "/notes", label: "Notes", icon: RiStickyNoteLine },
  { path: "/materials", label: "Materials", icon: RiBookOpenLine },
  { path: "/rooms", label: "Study Rooms", icon: RiTeamLine },
];

const profileItems = [
  { path: "/analytics", label: "Analytics", icon: RiBarChartBoxLine },
  { path: "/ai", label: "AI Assistant", icon: RiRobot2Line },
  { path: "/profile", label: "My Profile", icon: RiUserLine },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isActive = (path) => {
    return (
      location.pathname === path ||
      (path === "/rooms" && location.pathname.startsWith("/room/"))
    );
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 h-16 glass border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-gradient-to-br from-accent-purple to-accent-indigo rounded-lg flex items-center justify-center shadow-glow-sm">
            <RiFlashlightLine className="text-white text-base" />
          </div>
          <span className="font-bold text-lg text-white tracking-tight">
            Momentum<span className="text-accent-glow">AI</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {mainNavItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link ${isActive(path) ? "active" : ""}`}
            >
              <Icon className="text-base" />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        <div className="hidden lg:block relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-indigo flex items-center justify-center text-xs font-bold text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-white/70 font-medium max-w-[110px] truncate">
              {user?.name}
            </span>
            <RiArrowDownSLine className="text-white/40" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 w-56 bg-dark-800 border border-surface-border rounded-xl shadow-card p-2">
              {profileItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setProfileOpen(false)}
                  className={`nav-link w-full mb-1 ${
                    location.pathname === path ? "active" : ""
                  }`}
                >
                  <Icon className="text-base" />
                  <span>{label}</span>
                </Link>
              ))}

              <button
                onClick={handleLogout}
                className="nav-link w-full text-red-400 hover:bg-red-500/10"
              >
                <RiLogoutBoxLine className="text-base" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

        <button
          className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-white/70"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <RiCloseLine /> : <RiMenuLine />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-dark-800 border-b border-surface-border py-3 px-4 animate-slide-up">
          {[...mainNavItems, ...profileItems].map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={`nav-link w-full mb-1 ${isActive(path) ? "active" : ""}`}
            >
              <Icon className="text-base" />
              <span>{label}</span>
            </Link>
          ))}

          <button
            onClick={() => {
              setMobileOpen(false);
              handleLogout();
            }}
            className="nav-link w-full mt-2 text-red-400 hover:bg-red-500/10"
          >
            <RiLogoutBoxLine className="text-base" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
}