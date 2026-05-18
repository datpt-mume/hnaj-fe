import { createContext } from 'react'
import type { AuthUser } from '../../types/domain'
import type { LoginInput, RegisterInput } from './auth-api'

export type AuthModalMode = 'login' | 'register'

export type AuthContextValue = {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  isBootstrapping: boolean
  isAuthModalOpen: boolean
  authModalMode: AuthModalMode
  openAuthModal: (mode?: AuthModalMode) => void
  closeAuthModal: () => void
  logout: () => void
  loginAction: (input: LoginInput) => Promise<void>
  registerAction: (input: RegisterInput) => Promise<void>
  ensureAuthOrPrompt: (mode?: AuthModalMode) => boolean
}

export const AuthContext = createContext<AuthContextValue | null>(null)
