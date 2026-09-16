import React from 'react';
import { Button } from '../components/Button';
import { ArrowLeft } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg text-text px-6 text-center">
      <span className="font-mono text-xs tracking-widest text-text-muted uppercase mb-4">
        404 / Page Not Found
      </span>
      <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-text mb-4">
        404
      </h1>
      <p className="text-text-muted max-w-md text-base md:text-lg mb-8 leading-relaxed">
        The requested page does not exist or has been moved within this portfolio.
      </p>
      <Button variant="primary" size="md" href="/" className="font-mono">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Return to Home
      </Button>
    </div>
  );
}

export default NotFound;
