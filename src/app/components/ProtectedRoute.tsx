import { Navigate, useLocation } from "react-router";
// TODO: uncomment when backend is ready
// import { verifyToken } from "../../services/authService";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: string;
}

/**
 * ProtectedRoute — Guards dashboard routes by role.
 *
 * TODO: replace sessionStorage check with JWT verification
 *       when Spring Boot backend is connected:
 *
 *  1. Read JWT from sessionStorage (or httpOnly cookie)
 *  2. Call GET /api/auth/me to verify token server-side
 *  3. Check that response.role matches allowedRole
 *  4. If token is expired, attempt refresh via POST /api/auth/refresh
 *  5. If refresh fails, redirect to /login/:role
 */
export default function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  // TODO: replace with JWT from Spring Boot
  const userRole = sessionStorage.getItem("userRole");
  const location = useLocation();

  if (!userRole) {
    // No role stored, redirect to select-role page
    return <Navigate to="/select-role" state={{ from: location }} replace />;
  }

  if (userRole !== allowedRole) {
    // Role doesn't match the required role for this dashboard
    return <Navigate to="/select-role" replace />;
  }

  return <>{children}</>;
}
