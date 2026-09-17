import React from 'react';
import { Link } from 'react-router-dom';
import NexviaLogo from '../components/NexviaLogo';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-nexvia-cream p-4 sm:p-8 flex items-center justify-center font-sans antialiased text-nexvia-charcoal selection:bg-nexvia-amber selection:text-nexvia-charcoal">
      <div className="w-full max-w-md bg-nexvia-charcoal rounded-4xl sm:rounded-5xl p-8 sm:p-10 text-center text-nexvia-ivory shadow-2xl border border-nexvia-charcoal-border">
        <div className="flex items-center justify-center mb-6">
          <NexviaLogo size="sm" dark={true} showWordmark={true} />
        </div>
        <span className="font-mono text-6xl font-extrabold text-nexvia-amber block mb-2">404</span>
        <h2 className="text-2xl font-bold mb-2 text-nexvia-ivory">Page Not Found</h2>
        <p className="text-[#A5A298] text-xs sm:text-sm mb-6">
          The requested link, project, or presence does not exist on Nexvia.
        </p>
        <Link to="/">
          <Button variant="primary" className="w-full justify-center">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
