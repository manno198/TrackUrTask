import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getErrorMessage } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      const redirectTo = location.state?.from || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-chartreuse" data-testid="login-page">
      {/* Left: brand panel */}
      <div className="relative bg-ink text-chartreuse flex flex-col justify-center px-8 py-16 md:px-16 overflow-hidden">
        <div className="absolute top-8 left-8 flex items-center gap-2.5">
          <div className="w-9 h-9 bg-chartreuse rounded-md flex items-center justify-center border-2 border-chartreuse">
            <CheckSquare className="w-5 h-5 text-ink" />
          </div>
          <span className="font-heading font-extrabold tracking-tight">TrackUrTask</span>
        </div>

        <p className="eyebrow text-chartreuse/60 mb-4">Employee Task Management</p>
        <h1 className="font-heading font-extrabold text-5xl md:text-6xl leading-[0.95] tracking-tight mb-6 text-chartreuse">
          TRACK<br />UR<br />TASK
        </h1>
        <p className="text-chartreuse/80 max-w-sm text-base">
          One place for your team's tasks, priorities, and deadlines &mdash; no
          spreadsheets required.
        </p>

        {/* decorative grid accent */}
        <div className="hidden md:grid grid-cols-4 gap-2 absolute bottom-10 right-10 opacity-80">
          {['bg-chartreuse', 'bg-electric', 'bg-spring', 'bg-flash', 'bg-electric', 'bg-flash', 'bg-chartreuse', 'bg-spring'].map((c, i) => (
            <span key={i} className={`w-3 h-3 ${c}`} />
          ))}
        </div>
      </div>

      {/* Right: form panel */}
      <div className="flex items-center justify-center px-4 py-12 md:py-0">
        <div className="card w-full max-w-sm">
          <p className="eyebrow text-ink/50 mb-1">Admin Access</p>
          <h2 className="text-2xl font-heading font-extrabold mb-6">Sign in</h2>

          <form onSubmit={handleSubmit} className="space-y-4" data-testid="login-form">
            {error && (
              <div className="bg-red-50 border-2 border-red-500 text-red-700 px-4 py-3 rounded-lg text-sm font-medium" data-testid="login-error">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wide text-ink mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                data-testid="login-email-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="admin@company.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wide text-ink mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                data-testid="login-password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              data-testid="login-submit-button"
              disabled={loading}
              className="btn btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
