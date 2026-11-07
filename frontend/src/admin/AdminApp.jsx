import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from '../context/auth.js';
import AcceptLinkPage from './AcceptLinkPage.jsx';
import ActivityLogPage from './ActivityLogPage.jsx';
import AdminLayout from './AdminLayout.jsx';
import AdminsPage from './AdminsPage.jsx';
import LoginPage from './LoginPage.jsx';
import ServicesManager from './ServicesManager.jsx';
import ToastProvider from './ToastProvider.jsx';
import './admin.css';

export default function AdminApp() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="accept" element={<AcceptLinkPage />} />
        <Route
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<ServicesManager />} />
          <Route path="admins" element={<AdminsPage />} />
          <Route path="activity" element={<ActivityLogPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </ToastProvider>
  );
}

// Sends anyone who is not logged in to the login page, remembering where they were going.
function RequireAdmin({ children }) {
  const { admin, status } = useAuth();
  const location = useLocation();
  if (status === 'loading') {
    return (
      <div className="admin-loading" role="status">
        <span className="spinner" aria-hidden="true" /> Loading…
      </div>
    );
  }
  if (!admin) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  return children;
}
