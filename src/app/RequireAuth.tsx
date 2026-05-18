import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '../features/auth/use-auth'

export function RequireAuth() {
  const location = useLocation()
  const { isAuthenticated, isBootstrapping, openAuthModal } = useAuth()

  useEffect(() => {
    if (!isAuthenticated && !isBootstrapping) {
      openAuthModal('login')
    }
  }, [isAuthenticated, isBootstrapping, openAuthModal])

  if (isBootstrapping) {
    return <div className="glass-card p-6 text-sm text-[#6f668d]">Đang kiểm tra đăng nhập...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location.pathname }} replace />
  }

  return <Outlet />
}
