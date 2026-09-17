import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NexviaLogo from '../components/NexviaLogo';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Invalid email or password. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-nexvia-cream p-4 sm:p-8 flex items-center justify-center font-sans antialiased text-nexvia-charcoal selection:bg-nexvia-amber selection:text-nexvia-charcoal">
      <div className="w-full max-w-lg">
        <div className="bg-nexvia-charcoal rounded-4xl sm:rounded-5xl p-8 sm:p-12 text-nexvia-ivory shadow-2xl border border-nexvia-charcoal-border">
          
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-nexvia-charcoal-border/70">
            <Link to="/" className="flex items-center gap-2.5">
              <NexviaLogo size="sm" dark={true} showWordmark={true} />
            </Link>
            <Badge variant="amber" size="sm">Sign In</Badge>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-nexvia-ivory">
              Welcome back to <span className="text-nexvia-amber">Nexvia</span>
            </h1>
            <p className="text-[#A5A298] text-xs sm:text-sm">
              Your work. Your links. Your next. Sign in to your workspace.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-950/40 border border-red-500/50 flex items-start gap-3 text-red-200 text-xs">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email or Username"
              type="text"
              placeholder="name@company.com or @handle"
              icon={Mail}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#A5A298]">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-nexvia-amber hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full justify-center"
                isLoading={loading}
              >
                Sign In to Studio <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-nexvia-charcoal-border/70 text-center text-xs text-[#A5A298]">
            Don't have an account yet?{' '}
            <Link to="/signup" className="font-semibold text-nexvia-amber hover:underline">
              Create one now
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
