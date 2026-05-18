import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { clearToken, readToken, writeToken } from '../../lib/auth/token-store'
import { ApiClientError, queryKeys } from '../../lib/api/client'
import { queryClient } from '../../app/query-client'
import { getMe, login, register, type LoginInput, type RegisterInput } from './auth-api'
import { useToast } from '../../components/common/use-toast'
import { AuthContext, type AuthContextValue, type AuthModalMode } from './auth-context-store'

export function AuthProvider({ children }: { children: ReactNode }) {
  const { showToast } = useToast()
  const [token, setToken] = useState<string | null>(() => readToken())
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('login')
  const [isAuthModalOpen, setAuthModalOpen] = useState(false)

  const meQuery = useQuery({
    queryKey: queryKeys.me,
    queryFn: getMe,
    enabled: Boolean(token),
    retry: false,
  })

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (payload) => {
      writeToken(payload.token)
      setToken(payload.token)
      queryClient.setQueryData(queryKeys.me, payload.user)
      setAuthModalOpen(false)
      showToast('Đăng nhập thành công ✨', 'success')
    },
  })

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: (payload) => {
      writeToken(payload.token)
      setToken(payload.token)
      queryClient.setQueryData(queryKeys.me, payload.user)
      setAuthModalOpen(false)
      showToast('Tạo tài khoản thành công 🎉', 'success')
    },
  })

  const logout = useCallback(() => {
    clearToken()
    setToken(null)
    queryClient.removeQueries({ queryKey: queryKeys.me })
    queryClient.invalidateQueries()
    showToast('Bạn đã đăng xuất.', 'info')
  }, [showToast])

  const openAuthModal = useCallback((mode: AuthModalMode = 'login') => {
    setAuthModalMode(mode)
    setAuthModalOpen(true)
  }, [])

  const closeAuthModal = useCallback(() => setAuthModalOpen(false), [])

  const ensureAuthOrPrompt = useCallback(
    (mode: AuthModalMode = 'login') => {
      if (token && meQuery.data) {
        return true
      }

      openAuthModal(mode)
      showToast('Bạn cần đăng nhập để dùng tính năng này.', 'info')
      return false
    },
    [meQuery.data, openAuthModal, showToast, token],
  )

  const loginAction = useCallback(
    async (input: LoginInput) => {
      await loginMutation.mutateAsync(input)
    },
    [loginMutation],
  )

  const registerAction = useCallback(
    async (input: RegisterInput) => {
      await registerMutation.mutateAsync(input)
    },
    [registerMutation],
  )

  useEffect(() => {
    if (meQuery.error instanceof ApiClientError && meQuery.error.code === 'UNAUTHORIZED' && token) {
      clearToken()
      setToken(null)
      queryClient.removeQueries({ queryKey: queryKeys.me })
    }
  }, [meQuery.error, token])

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user: meQuery.data ?? null,
      isAuthenticated: Boolean(token && meQuery.data),
      isBootstrapping: Boolean(token) && meQuery.isLoading,
      isAuthModalOpen,
      authModalMode,
      openAuthModal,
      closeAuthModal,
      logout,
      loginAction,
      registerAction,
      ensureAuthOrPrompt,
    }),
    [
      token,
      meQuery.data,
      meQuery.isLoading,
      isAuthModalOpen,
      authModalMode,
      openAuthModal,
      closeAuthModal,
      logout,
      loginAction,
      registerAction,
      ensureAuthOrPrompt,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
