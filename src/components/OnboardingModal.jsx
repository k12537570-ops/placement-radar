import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { Sliders, Target, Map, ArrowRight, Check } from 'lucide-react';

export default function OnboardingModal() {
  const { showOnboarding, closeOnboarding } = useAuthStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  if (!showOnboarding) return null;

  const slides = [
    {
      step: '1',
      title: 'Calibrate Your Skills',
      icon: Sliders,
      headline: 'Rate 30 core skills honestly (0 to 5)',
      description: 'Slide through Core CS, Languages, Web, Data, and Tools. Use the "Confidence Check" toggle to signal what you can code live in a placement interview without Google.',
      accentBadge: 'Step 1 of 3'
    },
    {
      step: '2',
      title: 'Target Your Dream Role',
      icon: Target,
      headline: 'Match against 10 industry profiles + Company Mode',
      description: 'Choose from Software Engineer, Full Stack, DevOps, Data Analyst, and more. Switch Company Mode (Product, Startup, FAANG, Service) to dynamically scale benchmarks.',
      accentBadge: 'Step 2 of 3'
    },
    {
      step: '3',
      title: 'Instant Radar & Week-by-Week Roadmap',
      icon: Map,
      headline: 'Visualize gaps, follow study sprints & build ATS resume',
      description: 'Get an instant circular Readiness Score, simulate score improvements in the What-if simulator, follow weekly curated free resources, and export an ATS-optimized resume.',
      accentBadge: 'Step 3 of 3'
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      closeOnboarding();
      navigate('/skills');
    }
  };

  const handleSkip = () => {
    closeOnboarding();
    navigate('/skills');
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-bg-card rounded-2xl border border-border shadow-2xl p-6 sm:p-8 flex flex-col justify-between animate-in zoom-in-95 duration-200">
        <div>
          {/* Header pill & Skip */}
          <div className="flex items-center justify-between mb-6">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent bg-accent-light px-2.5 py-1 rounded-full">
              {slide.accentBadge}
            </span>
            <button
              onClick={handleSkip}
              className="text-xs text-text-subtle hover:text-text font-medium transition-colors"
            >
              Skip tour
            </button>
          </div>

          {/* Icon Box */}
          <div className="w-16 h-16 rounded-2xl bg-accent-light/70 text-accent flex items-center justify-center mb-6 shadow-sm">
            <Icon className="w-8 h-8 stroke-[2.2]" />
          </div>

          {/* Title & Content */}
          <h2 className="font-serif text-2xl font-bold text-text mb-2">
            {slide.title}
          </h2>
          <h3 className="text-sm font-semibold text-accent mb-3">
            {slide.headline}
          </h3>
          <p className="text-sm text-text-muted leading-relaxed mb-6">
            {slide.description}
          </p>
        </div>

        {/* Footer with dots & buttons */}
        <div className="pt-6 border-t border-border flex items-center justify-between">
          {/* Slide dots */}
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all duration-200 ${
                  i === currentSlide ? 'w-6 bg-accent' : 'w-2 bg-border hover:bg-text-subtle'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Action button */}
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-accent-contrast font-medium text-sm hover:bg-accent-hover shadow-sm transition-all active:scale-95"
          >
            {currentSlide === slides.length - 1 ? (
              <>
                <span>Start Calibrating</span>
                <Check className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
