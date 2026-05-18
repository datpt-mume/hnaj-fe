import type { ApiErrorCode, ApiResponse } from '../../types/api'
import { readToken } from '../auth/token-store'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api'

export class ApiClientError extends Error {
  constructor(
    public readonly code: ApiErrorCode,
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message)
    this.name = 'ApiClientError'
  }
}

function buildUrl(path: string, params?: Record<string, unknown>) {
  const url = new URL(path.startsWith('/') ? `${API_BASE_URL}${path}` : `${API_BASE_URL}/${path}`)

  if (!params) return url.toString()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    url.searchParams.set(key, String(value))
  })

  return url.toString()
}

type RequestConfig = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  params?: Record<string, unknown>
  body?: unknown
  auth?: boolean
  signal?: AbortSignal
}

export async function apiRequest<T>(path: string, config: RequestConfig = {}): Promise<T> {
  const token = config.auth ? readToken() : null

  const response = await fetch(buildUrl(path, config.params), {
    method: config.method ?? 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: config.body ? JSON.stringify(config.body) : undefined,
    signal: config.signal,
  })

  let payload: ApiResponse<T>
  try {
    payload = (await response.json()) as ApiResponse<T>
  } catch {
    throw new ApiClientError('INTERNAL_ERROR', 'Không đọc được phản hồi từ máy chủ.', response.status)
  }

  if (!response.ok || payload.success === false) {
    const code = payload.success === false ? payload.error.code : 'INTERNAL_ERROR'
    const message = payload.success === false ? payload.error.message : 'Có lỗi xảy ra.'
    const details = payload.success === false ? payload.error.details : undefined

    throw new ApiClientError(code, message, response.status, details)
  }

  return payload.data
}

export const queryKeys = {
  me: ['auth', 'me'] as const,
  randomPlaces: (filters: Record<string, unknown>) => ['places', 'random', filters] as const,
  placesList: (filters: Record<string, unknown>) => ['places', 'list', filters] as const,
  placeDetail: (id: string) => ['places', 'detail', id] as const,
  placeReviews: (id: string, page: number, limit: number) => ['places', 'reviews', id, page, limit] as const,
  favoritePlaces: (page: number, limit: number) => ['users', 'favorites', page, limit] as const,
}
