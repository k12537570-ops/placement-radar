import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg text-text p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-accent-light text-accent flex items-center justify-center mx-auto shadow-sm">
          <Compass className="w-8 h-8 stroke-[2.2]" />
        </div>

        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-accent font-bold">
            404 ERROR • OFF RADAR
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-text mt-2">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-2 leading-relaxed">
            The studio page you are looking for does not exist or may have moved. Check your navigation radar below.
          </p>
        </div>

        <div>
          <Link
            to="/skills"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-accent-contrast font-medium text-xs hover:bg-accent-hover shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Skills Studio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
