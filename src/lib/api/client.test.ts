import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiClientError, apiRequest } from './client'

describe('api client', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('returns data when api response is successful', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        data: { foo: 'bar' },
        message: 'OK',
      }),
    } as Response)

    const data = await apiRequest<{ foo: string }>('/test')

    expect(data).toEqual({ foo: 'bar' })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('attaches bearer token when auth=true', async () => {
    localStorage.setItem('hnaj_token', 'sample-token')

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: {}, message: 'OK' }),
    } as Response)

    await apiRequest('/secure', { auth: true })

    const requestConfig = fetchMock.mock.calls[0][1] as RequestInit
    expect(requestConfig.headers).toMatchObject({ Authorization: 'Bearer sample-token' })
  })

  it('throws typed error when backend returns business error', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Sai token',
        },
      }),
    } as Response)

    await expect(apiRequest('/secure', { auth: true })).rejects.toBeInstanceOf(ApiClientError)
    await expect(apiRequest('/secure', { auth: true })).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
      status: 401,
    })
  })
})
