import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import HomePage from './HomePage'

const showToast = vi.fn()
const ensureAuthOrPrompt = vi.fn(() => true)
const fetchRandomPlaces = vi.fn()

vi.mock('../components/common/use-toast', () => ({
  useToast: () => ({ showToast }),
}))

vi.mock('../features/auth/use-auth', () => ({
  useAuth: () => ({
    ensureAuthOrPrompt,
    isAuthenticated: false,
  }),
}))

vi.mock('../features/places/places-api', () => ({
  fetchRandomPlaces: (...args: unknown[]) => fetchRandomPlaces(...args),
  fetchMyFavorites: vi.fn(async () => ({
    items: [],
    pagination: {
      page: 1,
      limit: 1,
      total: 0,
      total_pages: 1,
    },
  })),
  favoritePlace: vi.fn(),
  unfavoritePlace: vi.fn(),
}))

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <HomePage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('HomePage', () => {
  it('renders random recommended places from api', async () => {
    fetchRandomPlaces.mockResolvedValue({
      items: [
        {
          id: 'place_1',
          displayName: 'Bún chả Kawaii',
          formattedAddress: 'Cầu Giấy, Hà Nội',
          types: ['restaurant'],
          primary_category: 'food',
          rating: 4.5,
          googleMapsUri: null,
          nationalPhoneNumber: null,
          regularOpeningHours: null,
          is_open_now: true,
        },
      ],
      filters: {
        primary_category: 'food',
        district: null,
        area: null,
        open_now: true,
        favorite_only: false,
        limit: 3,
      },
    })

    renderPage()

    expect(await screen.findByText('Bún chả Kawaii')).toBeInTheDocument()
    expect(screen.getByText(/Cầu Giấy, Hà Nội/)).toBeInTheDocument()
    expect(fetchRandomPlaces).toHaveBeenCalled()
  })
})
