import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NexviaLogo from '../components/NexviaLogo';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [devData, setDevData] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await forgotPassword(email);
      setSubmitted(true);
      if (data.resetToken) {
        setDevData(data);
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Unable to process request.');
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
            <Badge variant="amber" size="sm">Password Recovery</Badge>
          </div>

          {submitted ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-950/40 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/40 text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-nexvia-ivory">Check Your Inbox</h2>
              <p className="text-[#A5A298] text-xs sm:text-sm mb-6">
                If an account exists for <span className="font-semibold text-nexvia-amber">{email}</span>, a reset link has been dispatched.
              </p>

              {devData && (
                <div className="bg-nexvia-charcoal-card p-5 rounded-2xl border border-nexvia-charcoal-border text-left mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="blue" size="sm">Dev Mode Auto-Reset</Badge>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full justify-center"
                    onClick={() => navigate(`/reset-password/${devData.resetToken}`)}
                  >
                    Click to Open Reset Page →
                  </Button>
                </div>
              )}

              <Link to="/login" className="text-xs font-semibold text-nexvia-amber hover:underline">
                Return to Sign In
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-nexvia-ivory">
                  Reset your password
                </h1>
                <p className="text-[#A5A298] text-xs sm:text-sm">
                  Enter your account email address below and we will send you a secure link to reset your credentials.
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full justify-center"
                    isLoading={loading}
                  >
                    Send Reset Link <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-nexvia-charcoal-border/70 text-center text-xs text-[#A5A298]">
                Remember your password?{' '}
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
