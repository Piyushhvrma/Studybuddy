import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/api";
import { RiFlashlightLine, RiEyeLine, RiEyeOffLine, RiMailLine, RiLockLine } from "react-icons/ri";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await loginUser(form);
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* BG effects */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-accent-indigo/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-accent-purple to-accent-indigo rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
            <RiFlashlightLine className="text-white text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-white/50 text-sm">Continue your learning journey</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 rounded-2xl">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <RiMailLine className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <RiLockLine className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPass ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-accent-glow hover:text-white transition-colors font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
