const TOKEN_KEY = 'hnaj_token'

let inMemoryToken: string | null = null

export function readToken() {
  if (inMemoryToken) return inMemoryToken

  const persisted = localStorage.getItem(TOKEN_KEY)
  inMemoryToken = persisted
  return persisted
}

export function writeToken(token: string) {
  inMemoryToken = token
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  inMemoryToken = null
  localStorage.removeItem(TOKEN_KEY)
}
