import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import StudentDashboard from "./components/StudentDashboard";
import TeacherDashboard from "./components/TeacherDashboard";
import DirectorDashboard from "./components/DirectorDashboard";
import AdministrativeDashboard from "./components/AdministrativeDashboard";
import AdminPanel from "./components/AdminPanel";
import ScheduleBuilder from "./components/ScheduleBuilder";
import ScheduleViewer from "./components/ScheduleViewer";
import MySchedule from "./components/MySchedule";
import TeacherScheduleViewer from "./components/TeacherScheduleViewer";
import RoomScheduleViewer from "./components/RoomScheduleViewer";
import ConfirmEmailPage from "./components/ConfirmEmailPage";
import ChangePasswordPage from "./components/ChangePasswordPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import ResetPasswordPage from "./components/ResetPasswordPage";
import TestConnection from "./components/TestConnection";
import Messaging from "./components/Messaging";
import "./App.css";

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.5rem',
        color: '#667eea'
      }}>
        <div>🔒 Vérification de l'authentification...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/director-dashboard" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/director-dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/test-connection" element={<TestConnection />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
            <Route path="/auth/confirm-email" element={<ConfirmEmailPage />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />
            <Route
              path="/student-dashboard"
              element={
                <ProtectedRoute allowedRoles={["etudiant"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher-dashboard"
              element={
                <ProtectedRoute allowedRoles={["enseignant"]}>
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/director-dashboard"
              element={
                <ProtectedRoute allowedRoles={["directeur_departement"]}>
                  <DirectorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={["administratif"]}>
                  <AdministrativeDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["directeur_departement"]}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/schedule-builder"
              element={
                <ProtectedRoute allowedRoles={["directeur_departement"]}>
                  <ScheduleBuilder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/schedule-viewer"
              element={
                <ProtectedRoute allowedRoles={["directeur_departement"]}>
                  <ScheduleViewer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-schedule"
              element={
                <ProtectedRoute allowedRoles={["etudiant", "enseignant", "directeur_departement"]}>
                  <MySchedule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher-schedules"
              element={
                <ProtectedRoute allowedRoles={["directeur_departement"]}>
                  <TeacherScheduleViewer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/room-schedules"
              element={
                <ProtectedRoute allowedRoles={["directeur_departement"]}>
                  <RoomScheduleViewer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messagerie"
              element={
                <ProtectedRoute allowedRoles={["etudiant", "enseignant", "administratif", "directeur_departement"]}>
                  <Messaging />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
