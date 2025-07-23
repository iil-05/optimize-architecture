import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProjectProvider } from './contexts/ProjectContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { optimizedStorage } from './core/OptimizedStorage';
import { useEffect } from 'react';

import AuthGuard from './components/AuthGuard';

import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import Preview from './pages/Preview';
import Profile from './pages/Profile';
import Billing from './pages/Billing';
import Settings from './pages/Settings';
import Team from './pages/Team';
import Support from './pages/Support';
import TemplateGallery from './pages/TemplateGallery';
import SiteViewer from './pages/SiteViewer';
import SiteAdmin from './pages/SiteAdmin';
import SuperAdmin from './pages/SuperAdmin';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

function App() {
  useEffect(() => {
    // Initialize optimized storage system
    optimizedStorage.initialize();
  }, []);

  return (
    <ThemeProvider>
      <ProjectProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />

            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Public site viewer route */}
              <Route path="/site/:websiteUrl" element={<SiteViewer />} />

              {/* Admin panel route */}
              <Route
                path="/admin/:id"
                element={
                  <AuthGuard requireProjectAccess={window.location.pathname.split('/')[2]}>
                    <SiteAdmin />
                  </AuthGuard>
                }
              />

              {/* SuperAdmin route */}
              <Route
                path="/superadmin"
                element={
                  <AuthGuard>
                    <SuperAdmin />
                  </AuthGuard>
                }
              />

              <Route path="/" element={<Navigate to="/dashboard" />} />

              <Route
                path="/dashboard"
                element={
                  <AuthGuard>
                    <Dashboard />
                  </AuthGuard>
                }
              />
              <Route
                path="/editor/:id"
                element={
                  <AuthGuard requireProjectAccess={window.location.pathname.split('/')[2]}>
                    <Editor />
                  </AuthGuard>
                }
              />
              <Route
                path="/preview/:id"
                element={
                  <AuthGuard requireProjectAccess={window.location.pathname.split('/')[2]}>
                    <Preview />
                  </AuthGuard>
                }
              />
              <Route
                path="/profile"
                element={
                  <AuthGuard>
                    <Profile />
                  </AuthGuard>
                }
              />
              <Route
                path="/billing"
                element={
                  <AuthGuard>
                    <Billing />
                  </AuthGuard>
                }
              />
              <Route
                path="/settings"
                element={
                  <AuthGuard>
                    <Settings />
                  </AuthGuard>
                }
              />
              <Route
                path="/team"
                element={
                  <AuthGuard>
                    <Team />
                  </AuthGuard>
                }
              />
              <Route
                path="/support"
                element={
                  <AuthGuard>
                    <Support />
                  </AuthGuard>
                }
              />
              <Route
                path="/templates"
                element={
                  <AuthGuard>
                    <TemplateGallery />
                  </AuthGuard>
                }
              />
            </Routes>
          </div>
        </Router>
      </ProjectProvider>
    </ThemeProvider>
  );
}

export default App;
