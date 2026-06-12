import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Tracker from "./pages/Tracker";
import Notes from "./pages/Notes";
import Materials from "./pages/Materials";
import AIAssistant from "./pages/AIAssistant";
import Profile from "./pages/Profile";

// Layout
import Navbar from "./components/Navbar";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-accent-purple border-t-transparent rounded-full animate-spin"></div></div>;
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" /> : children;
};

const AppLayout = ({ children }) => (
  <div className="min-h-screen">
    <Navbar />
    <main className="pt-16">
      {children}
    </main>
  </div>
);

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/tracker" element={<ProtectedRoute><AppLayout><Tracker /></AppLayout></ProtectedRoute>} />
      <Route path="/notes" element={<ProtectedRoute><AppLayout><Notes /></AppLayout></ProtectedRoute>} />
      <Route path="/materials" element={<ProtectedRoute><AppLayout><Materials /></AppLayout></ProtectedRoute>} />
      <Route path="/ai" element={<ProtectedRoute><AppLayout><AIAssistant /></AppLayout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
