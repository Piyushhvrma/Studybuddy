import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  RiDashboardLine, RiCalendarCheckLine, RiStickyNoteLine,
  RiBookOpenLine, RiRobot2Line, RiUserLine, RiLogoutBoxLine,
  RiFlashlightLine, RiMenuLine, RiCloseLine
} from "react-icons/ri";
import { useState } from "react";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: RiDashboardLine },
  { path: "/tracker", label: "Tracker", icon: RiCalendarCheckLine },
  { path: "/notes", label: "Notes", icon: RiStickyNoteLine },
  { path: "/materials", label: "Materials", icon: RiBookOpenLine },
  { path: "/ai", label: "AI Assistant", icon: RiRobot2Line },
  { path: "/profile", label: "Profile", icon: RiUserLine },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 h-16 glass border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-gradient-to-br from-accent-purple to-accent-indigo rounded-lg flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-all duration-300">
            <RiFlashlightLine className="text-white text-base" />
          </div>
          <span className="font-bold text-lg text-white tracking-tight">
            Momentum<span className="text-accent-glow">AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link ${location.pathname === path ? "active" : ""}`}
            >
              <Icon className="text-base" />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        {/* Right section */}
        <div className="hidden md:flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-indigo flex items-center justify-center text-xs font-bold text-white">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-white/70 font-medium">{user.name}</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-white/50 hover:text-red-400 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-red-500/10"
          >
            <RiLogoutBoxLine />
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-white/5 text-white/70"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <RiCloseLine className="text-xl" /> : <RiMenuLine className="text-xl" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-dark-800 border-b border-surface-border py-3 px-4 animate-slide-up">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={`nav-link w-full mb-1 ${location.pathname === path ? "active" : ""}`}
            >
              <Icon className="text-base" />
              <span>{label}</span>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="nav-link w-full text-red-400/70 hover:text-red-400 mt-2"
          >
            <RiLogoutBoxLine />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
}
