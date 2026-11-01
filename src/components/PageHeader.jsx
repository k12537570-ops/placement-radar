import React from 'react';

export default function PageHeader({
  step,
  stepTotal = 3,
  stepLabel,
  title,
  subtitle,
  handwrittenNote,
  actions
}) {
  return (
    <div className="relative mb-8 pb-4 border-b border-border/60">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          {step && (
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent bg-accent-light px-2 py-0.5 rounded">
                STEP {step} OF {stepTotal}
              </span>
              {stepLabel && (
                <span className="font-mono text-xs text-text-subtle font-medium uppercase tracking-wider">
                  • {stepLabel}
                </span>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-baseline gap-3">
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-text">
              {title}
            </h1>
            {handwrittenNote && (
              <span className="font-handwriting text-accent font-bold text-xl sm:text-2xl transform -rotate-3 select-none inline-block">
                ~ {handwrittenNote}
              </span>
            )}
          </div>

          {subtitle && (
            <p className="mt-2 text-sm sm:text-base text-text-muted max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-3 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

