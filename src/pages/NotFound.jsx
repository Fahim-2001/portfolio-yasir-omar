import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';
import { PerspectiveFloor } from '../components/PerspectiveFloor';

export function NotFound() {
  return (
    <main className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div aria-hidden="true" className="grain" />
      <PerspectiveFloor className="-z-10 h-1/2" />

      <span className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-text-muted">404 / Page Not Found</span>
      <h1 className="extrude-xl mb-8 text-[clamp(6rem,24vw,13rem)] font-black leading-[0.85] tracking-[-0.06em] text-text">
        404
      </h1>
      <p className="mb-10 max-w-md text-base leading-relaxed text-text-muted md:text-lg">
        The requested page does not exist or has been moved within this portfolio.
      </p>
      <Button variant="primary" size="md" href="/" className="font-mono">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Return to Home
      </Button>
    </main>
  );
}

export default NotFound;
