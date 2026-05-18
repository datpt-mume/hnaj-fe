import type { Pagination } from './api'

export type PlaceCategory =
  | 'food'
  | 'coffee_tea'
  | 'bar_pub'
  | 'gaming'
  | 'culture_art'
  | 'shopping'
  | 'entertainment'

export type Place = {
  id: string
  displayName: string
  formattedAddress: string
  types: string[]
  primary_category: PlaceCategory
  rating: number | null
  googleMapsUri: string | null
  nationalPhoneNumber: string | null
  regularOpeningHours: Record<string, unknown> | null
  is_open_now: boolean | null
}

export type PlaceDetail = Place & {
  internal_rating_avg: number | null
  internal_review_count: number
  is_favorited: boolean
}

export type PlacesRandomFilters = {
  primary_category?: PlaceCategory
  district?: string
  area?: string
  open_now?: boolean
  favorite_only?: boolean
  limit?: number
}

export type PlacesListFilters = {
  q?: string
  primary_category?: PlaceCategory
  district?: string
  area?: string
  open_now?: boolean
  page?: number
  limit?: number
}

export type PlaceReview = {
  id: number
  rating: number
  comment: string | null
  user: {
    id: number
    name: string
  }
  created_at: string
  updated_at: string
}

export type AuthUser = {
  id: number
  name: string | null
  email: string
  role: 'user' | 'admin'
}

export type AuthPayload = {
  token: string
  expires_at: string
  user: AuthUser
}

export type PlacesListPayload = {
  items: Place[]
  pagination: Pagination
}

export type PlacesRandomPayload = {
  items: Place[]
  filters: {
    primary_category: PlaceCategory | null
    district: string | null
    area: string | null
    open_now: boolean | null
    favorite_only: boolean
    limit: number
  }
}
