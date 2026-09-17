import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NexviaLogo from '../components/NexviaLogo';
import Button from '../components/ui/Button';

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const triggerVerification = async () => {
      try {
        await verifyEmail(token);
        setSuccess(true);
      } catch (err) {
        setError(err.response?.data?.error?.message || 'Verification token is invalid or has expired.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      triggerVerification();
    } else {
      setError('No verification token provided.');
      setLoading(false);
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-nexvia-cream p-4 sm:p-8 flex items-center justify-center font-sans antialiased text-nexvia-charcoal selection:bg-nexvia-amber selection:text-nexvia-charcoal">
      <div className="w-full max-w-md">
        <div className="bg-nexvia-charcoal rounded-4xl sm:rounded-5xl p-8 sm:p-10 text-nexvia-ivory shadow-2xl border border-nexvia-charcoal-border text-center">
          
          <div className="flex items-center justify-center mb-8">
            <NexviaLogo size="md" dark={true} showWordmark={true} />
          </div>

          {loading && (
            <div className="py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-nexvia-amber border-t-transparent mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-1 text-nexvia-ivory">Verifying your email...</h2>
              <p className="text-[#A5A298] text-xs sm:text-sm">Please wait while we validate your credentials.</p>
            </div>
          )}

          {!loading && success && (
            <div className="py-4">
              <div className="w-16 h-16 bg-emerald-950/40 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/40 text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-nexvia-ivory">Email Verified!</h2>
              <p className="text-[#A5A298] text-xs sm:text-sm mb-6">
                Your account is now fully active. You can sign in and launch your digital presence.
              </p>
              <Button
                variant="primary"
                className="w-full justify-center"
                onClick={() => navigate('/login')}
              >
                Proceed to Sign In <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}

          {!loading && error && (
            <div className="py-4">
              <div className="w-16 h-16 bg-red-950/40 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/40">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-nexvia-ivory">Verification Failed</h2>
              <p className="text-red-300 text-xs sm:text-sm mb-6">{error}</p>
              <Button
                variant="outline"
                className="w-full justify-center border-nexvia-charcoal-border text-nexvia-ivory hover:bg-white/5"
                onClick={() => navigate('/signup')}
              >
                Return to Signup
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
