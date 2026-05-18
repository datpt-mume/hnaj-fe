import { apiRequest } from '../../lib/api/client'
import type { AuthPayload, AuthUser } from '../../types/domain'

export type LoginInput = {
  email: string
  password: string
}

export type RegisterInput = {
  name?: string
  email: string
  password: string
}

export async function login(input: LoginInput) {
  return apiRequest<AuthPayload>('/auth/login', {
    method: 'POST',
    body: input,
  })
}

export async function register(input: RegisterInput) {
  return apiRequest<AuthPayload>('/auth/register', {
    method: 'POST',
    body: input,
  })
}

export async function getMe() {
  const payload = await apiRequest<{ user: AuthUser }>('/auth/me', {
    auth: true,
  })

  return payload.user
}
