import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NexviaLogo from '../components/NexviaLogo';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({ email: '', username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await signup(formData.email, formData.username, formData.password);
      setSuccessData(data);
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Failed to create account. Please try again.';
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
            <Badge variant="amber" size="sm">Get Started</Badge>
          </div>

          {successData ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-950/40 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/40 text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-nexvia-ivory">Verify Your Email</h2>
              <p className="text-[#A5A298] text-xs sm:text-sm mb-6">
                We've sent a verification link to <span className="font-semibold text-nexvia-amber">{formData.email}</span>.
              </p>

              {successData.verificationToken && (
                <div className="bg-nexvia-charcoal-card p-5 rounded-2xl border border-nexvia-charcoal-border text-left mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="blue" size="sm">Dev Mode Auto-Verify</Badge>
                    <span className="text-[11px] text-[#A5A298]">Local Simulation Active</span>
                  </div>
                  <p className="text-[11px] text-[#77756D] mb-3 font-mono break-all">
                    Token: {successData.verificationToken}
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full justify-center"
                    onClick={() => navigate(`/verify/${successData.verificationToken}`)}
                  >
                    Click to Auto-Verify Email →
                  </Button>
                </div>
              )}

              <Link to="/login" className="text-xs font-semibold text-nexvia-amber hover:underline">
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-nexvia-ivory">
                  Create your <span className="text-nexvia-amber">Nexvia</span> presence
                </h1>
                <p className="text-[#A5A298] text-xs sm:text-sm">
                  Your work. Your links. Your next. Claim your vanity identity in seconds.
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
                  label="Email Address"
                  type="email"
                  placeholder="name@company.com"
                  icon={Mail}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />

                <Input
                  label="Username / Presence Handle"
                  type="text"
                  placeholder="your_handle"
                  helperText="Lowercase letters, numbers, dashes and underscores."
                  icon={User}
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="At least 6 characters"
                  icon={Lock}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full justify-center"
                    isLoading={loading}
                  >
                    Create Free Account <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-nexvia-charcoal-border/70 text-center text-xs text-[#A5A298]">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-nexvia-amber hover:underline">
                  Sign In
                </Link>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
