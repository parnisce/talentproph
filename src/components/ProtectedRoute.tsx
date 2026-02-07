import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRole: 'seeker' | 'employer' | 'admin';
}

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
    const { id, role, loading } = useUser();

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <Loader2 className="animate-spin text-primary mx-auto mb-4" size={48} />
                    <p className="text-slate-600 font-medium">Verifying access...</p>
                </div>
            </div>
        );
    }

    // Not logged in - redirect to login
    if (!id) {
        return <Navigate to="/login" replace />;
    }

    // Logged in but wrong role - redirect to appropriate dashboard
    if (role !== allowedRole) {
        // Redirect to their correct dashboard
        if (role === 'seeker') {
            return <Navigate to="/seeker" replace />;
        } else if (role === 'employer') {
            return <Navigate to="/employer" replace />;
        } else if (role === 'admin') {
            return <Navigate to="/admin" replace />;
        }
        // Fallback to login if role is unknown
        return <Navigate to="/login" replace />;
    }

    // Correct role - allow access
    return <>{children}</>;
};

export default ProtectedRoute;
