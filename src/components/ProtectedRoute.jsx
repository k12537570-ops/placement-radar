import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';
import Navbar from './Navbar';
import OnboardingModal from './OnboardingModal';
import ToastContainer from './ToastContainer';

export default function ProtectedRoute() {
  const { user, isCheckingAuth } = useAuthStore();
  const { initUserData } = useAppStore();

  useEffect(() => {
    if (user?.email) {
      initUserData(user.email, Boolean(user.isGuest));
    }
  }, [user?.email, user?.isGuest, initUserData]);

  if (isCheckingAuth && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg text-text">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center text-accent animate-pulse">
            <Compass className="w-7 h-7 stroke-[2.2]" />
          </div>
          <span className="font-serif font-bold text-lg text-text">Loading Placement Radar...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-150">
        <Outlet />
      </main>
      <OnboardingModal />
      <ToastContainer />
    </div>
  );
}

