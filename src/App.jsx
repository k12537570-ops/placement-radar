import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardPage from './pages/DashboardPage';
import SkillsPage from './pages/SkillsPage';
import RolePage from './pages/RolePage';
import RadarPage from './pages/RadarPage';
import VerificationPage from './pages/VerificationPage';
import InterviewPage from './pages/InterviewPage';
import RoadmapPage from './pages/RoadmapPage';
import ResumePage from './pages/ResumePage';
import ReportPage from './pages/ReportPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import { useAuthStore } from './store/useAuthStore';
import { useAppStore } from './store/useAppStore';

function PublicRoute({ children }) {
  const { user } = useAuthStore();
  // Allow guest explorers to access signup and login to create/switch to a full account
  if (user && !user.isGuest) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function App() {
  const { user, checkAuth } = useAuthStore();
  const { initUserData } = useAppStore();

  useEffect(() => {
    // Check session on mount
    checkAuth();
    // Initialize DOM theme attributes immediately
    const userEmail = user?.email || 'guest';
    initUserData(userEmail);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Authentication Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        {/* Protected Application Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/role" element={<RolePage />} />
          <Route path="/radar" element={<RadarPage />} />
          <Route path="/verify" element={<VerificationPage />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
