import { Link, NavLink, Outlet } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { useAuth } from '../features/auth/use-auth'
import { AuthModal } from '../features/auth/AuthModal'

const navItems = [
  { to: '/', label: 'Random', emoji: '🎲' },
  { to: '/places', label: 'Khám phá', emoji: '🧭' },
  { to: '/favorites', label: 'Đã lưu', emoji: '💖' },
]

export function AppShell() {
  const { user, isAuthenticated, openAuthModal, logout } = useAuth()

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-4 pb-24 pt-4 md:px-6 md:pb-10">
      <header className="glass-card sticky top-3 z-40 mb-5 flex items-center justify-between gap-3 p-3">
        <Link to="/" className="inline-flex items-center gap-2">
          <span className="text-2xl">🍡</span>
          <div>
            <p className="font-display text-2xl leading-none text-ink">Hôm nay ăn gì?</p>
            <p className="text-xs text-[#7f769d]">Random quán xinh cho hội Gen Z</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {isAuthenticated && user ? (
            <>
              <span className="hidden rounded-full bg-mint px-3 py-2 text-xs font-semibold text-ink md:inline-flex">
                Xin chào, {user.name || user.email}
              </span>
              <Button variant="secondary" onClick={logout}>
                Đăng xuất
              </Button>
            </>
          ) : (
            <Button onClick={() => openAuthModal('login')}>Đăng nhập</Button>
          )}
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <nav className="fixed bottom-3 left-1/2 z-40 w-[calc(100%-1.5rem)] max-w-xl -translate-x-1/2 rounded-full border border-white/80 bg-white/95 p-2 shadow-cloud md:sticky md:top-[5.4rem] md:mx-auto md:mb-5 md:mt-0 md:w-full md:translate-x-0">
        <ul className="grid grid-cols-3 gap-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-center gap-1 rounded-full px-3 py-2 text-sm font-semibold transition ${
                    isActive ? 'bg-gradient-to-r from-candy to-coral text-white' : 'text-[#6f668d] hover:bg-cream'
                  }`
                }
              >
                <span>{item.emoji}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <AuthModal />
    </div>
  )
}
