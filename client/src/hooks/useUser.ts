import { createContext, createElement, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../models/user'
import { saveUser, loadUser } from '../services/api'
import {
  getSavedAccount,
  getSessionEmail,
  loginAccount,
  logoutAccount,
  registerAccount,
} from '../services/authLocal'

interface Credentials {
  nombre?: string
  email: string
  password: string
}

interface AuthResult {
  success: boolean
  hasProfile: boolean
}

interface UserContextValue {
  user: User | null
  isAuthenticated: boolean
  setUserData: (data: Partial<User>) => Partial<User>
  finalizeUser: (data?: Partial<User>) => Promise<void>
  register: (credentials: Credentials) => Promise<AuthResult>
  login: (credentials: Credentials) => Promise<AuthResult>
  logout: () => void
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [sessionEmail, setSessionEmail] = useState<string | null>(null)

  const setUserData = (data: Partial<User>) => {
    setUser((prev) => ({ ...(prev || ({} as User)), ...data } as User))
    return data
  }

  const finalizeUser = async (data?: Partial<User>) => {
    const payload = data ? { ...(user || {}), ...data } : user

    if (payload) {
      const saved = await saveUser(payload)
      setUser(saved)
    }
  }

  const register = async ({ nombre, email, password }: Credentials): Promise<AuthResult> => {
    registerAccount({
      nombre: nombre || email,
      email,
      password,
    })

    setSessionEmail(email)

    const currentUser = await loadUser()
    if (currentUser && currentUser.email.toLowerCase() === email.toLowerCase()) {
      setUser(currentUser)
      return { success: true, hasProfile: true }
    }

    setUser(null)
    return { success: true, hasProfile: false }
  }

  const login = async ({ email, password }: Credentials): Promise<AuthResult> => {
    const ok = loginAccount(email, password)
    if (!ok) return { success: false, hasProfile: false }

    setSessionEmail(email)

    const loadedUser = await loadUser()
    if (loadedUser && loadedUser.email.toLowerCase() === email.toLowerCase()) {
      setUser(loadedUser)
      return { success: true, hasProfile: true }
    }

    setUser(null)
    return { success: true, hasProfile: false }
  }

  const logout = () => {
    logoutAccount()
    setSessionEmail(null)
    setUser(null)
  }

  useEffect(() => {
    const email = getSessionEmail()
    setSessionEmail(email)

    if (!email) return

    loadUser().then((loadedUser) => {
      if (loadedUser && loadedUser.email.toLowerCase() === email.toLowerCase()) {
        setUser(loadedUser)
      }
    })
  }, [])

  const isAuthenticated = useMemo(() => {
    const account = getSavedAccount()
    if (!account || !sessionEmail) return false
    return account.email.toLowerCase() === sessionEmail.toLowerCase()
  }, [sessionEmail])

  return createElement(
    UserContext.Provider,
    { value: { user, isAuthenticated, setUserData, finalizeUser, register, login, logout } },
    children
  )
}

export const useUser = () => {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be inside UserProvider')
  return ctx
}
