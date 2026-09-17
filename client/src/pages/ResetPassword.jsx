import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NexviaLogo from '../components/NexviaLogo';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    setLoading(true);

    try {
      await resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Password reset failed or token expired.');
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
            <Badge variant="amber" size="sm">Secure Reset</Badge>
          </div>

          {success ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-950/40 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/40 text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-nexvia-ivory">Password Reset Complete</h2>
              <p className="text-[#A5A298] text-xs sm:text-sm mb-6">
                Your password has been successfully updated. You can now sign in to your Nexvia workspace.
              </p>
              <Button
                variant="primary"
                className="w-full justify-center"
                onClick={() => navigate('/login')}
              >
                Sign In Now <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-nexvia-ivory">
                  Create New Password
                </h1>
                <p className="text-[#A5A298] text-xs sm:text-sm">
                  Enter a strong new password for your account.
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
                  label="New Password"
                  type="password"
                  placeholder="At least 6 characters"
                  icon={Lock}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="Re-enter password"
                  icon={Lock}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full justify-center"
                    isLoading={loading}
                  >
                    Reset Password <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
