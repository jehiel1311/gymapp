export interface LocalAccount {
  email: string
  password: string
  nombre: string
}

const ACCOUNT_KEY = 'auth_account'
const SESSION_KEY = 'auth_session'

export function getSavedAccount(): LocalAccount | null {
  const stored = localStorage.getItem(ACCOUNT_KEY)
  if (!stored) return null

  try {
    return JSON.parse(stored) as LocalAccount
  } catch {
    return null
  }
}

export function registerAccount(account: LocalAccount): void {
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account))
  localStorage.setItem(SESSION_KEY, account.email)
}

export function loginAccount(email: string, password: string): boolean {
  const account = getSavedAccount()
  if (!account) return false

  const isValid = account.email.toLowerCase() === email.toLowerCase() && account.password === password

  if (isValid) {
    localStorage.setItem(SESSION_KEY, account.email)
  }

  return isValid
}

export function getSessionEmail(): string | null {
  return localStorage.getItem(SESSION_KEY)
}

export function logoutAccount(): void {
  localStorage.removeItem(SESSION_KEY)
}
