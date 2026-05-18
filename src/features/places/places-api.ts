import { apiRequest } from '../../lib/api/client'
import type { Paginated } from '../../types/api'
import type {
  Place,
  PlaceDetail,
  PlaceReview,
  PlacesListFilters,
  PlacesListPayload,
  PlacesRandomFilters,
  PlacesRandomPayload,
} from '../../types/domain'

export async function fetchRandomPlaces(filters: PlacesRandomFilters) {
  return apiRequest<PlacesRandomPayload>('/places/random', {
    params: {
      ...filters,
      open_now: filters.open_now ? 1 : undefined,
      favorite_only: filters.favorite_only ? 1 : undefined,
    },
    auth: filters.favorite_only,
  })
}

export async function fetchPlaces(filters: PlacesListFilters) {
  return apiRequest<PlacesListPayload>('/places', {
    params: {
      ...filters,
      open_now: filters.open_now ? 1 : undefined,
    },
  })
}

export async function fetchPlaceDetail(id: string) {
  return apiRequest<PlaceDetail>(`/places/${id}`, {
    auth: true,
  })
}

export async function favoritePlace(id: string) {
  return apiRequest<{ place: Place }>(`/places/${id}/favorite`, {
    method: 'POST',
    auth: true,
  })
}

export async function unfavoritePlace(id: string) {
  return apiRequest<Record<string, never>>(`/places/${id}/favorite`, {
    method: 'DELETE',
    auth: true,
  })
}

export async function fetchMyFavorites(page = 1, limit = 20) {
  return apiRequest<Paginated<Place>>('/users/me/favorites', {
    method: 'GET',
    params: { page, limit },
    auth: true,
  })
}

export async function fetchPlaceReviews(id: string, page = 1, limit = 20) {
  return apiRequest<Paginated<PlaceReview>>(`/places/${id}/reviews`, {
    params: { page, limit },
  })
}

export async function createReview(id: string, payload: { rating: number; comment?: string }) {
  return apiRequest<{ review: PlaceReview }>(`/places/${id}/reviews`, {
    method: 'POST',
    body: payload,
    auth: true,
  })
}

export async function updateMyReview(id: string, payload: { rating: number; comment?: string }) {
  return apiRequest<{ review: PlaceReview }>(`/places/${id}/reviews/me`, {
    method: 'PUT',
    body: payload,
    auth: true,
  })
}

export async function deleteMyReview(id: string) {
  return apiRequest<Record<string, never>>(`/places/${id}/reviews/me`, {
    method: 'DELETE',
    auth: true,
  })
}
