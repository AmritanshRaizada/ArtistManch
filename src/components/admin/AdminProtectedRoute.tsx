
import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

export default function AdminProtectedRoute() {
  const { loading, isAdmin } = useAdminAuth();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#0b0910] text-amber-300">
        Checking admin session...
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
