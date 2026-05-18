export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'INTERNAL_ERROR'

export type ApiSuccessResponse<T> = {
  success: true
  data: T
  message: string
}

export type ApiErrorResponse = {
  success: false
  error: {
    code: ApiErrorCode
    message: string
    details?: unknown
  }
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

export type Pagination = {
  page: number
  limit: number
  total: number
  total_pages: number
}

export type Paginated<T> = {
  items: T[]
  pagination: Pagination
}
