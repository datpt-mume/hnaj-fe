import { Suspense, lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from './AppShell'
import { RequireAuth } from './RequireAuth'
import { PageFallback } from './PageFallback'

const HomePage = lazy(() => import('../pages/HomePage'))
const PlacesPage = lazy(() => import('../pages/PlacesPage'))
const PlaceDetailPage = lazy(() => import('../pages/PlaceDetailPage'))
const FavoritesPage = lazy(() => import('../pages/FavoritesPage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageFallback />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'places',
        element: (
          <Suspense fallback={<PageFallback />}>
            <PlacesPage />
          </Suspense>
        ),
      },
      {
        path: 'places/:placeId',
        element: (
          <Suspense fallback={<PageFallback />}>
            <PlaceDetailPage />
          </Suspense>
        ),
      },
      {
        element: <RequireAuth />,
        children: [
          {
            path: 'favorites',
            element: (
              <Suspense fallback={<PageFallback />}>
                <FavoritesPage />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<PageFallback />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
])
