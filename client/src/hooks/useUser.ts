import { createContext, createElement, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../models/user'
import { saveUser, loadUser } from '../services/api'

interface UserContextValue {
  user: User | null
  setUserData: (data: Partial<User>) => Partial<User>
  finalizeUser: (data?: Partial<User>) => Promise<void>
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

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

  useEffect(() => {
    loadUser().then((u) => u && setUser(u))
  }, [])

  return createElement(
    UserContext.Provider,
    { value: { user, setUserData, finalizeUser } },
    children
  )
}

export const useUser = () => {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be inside UserProvider')
  return ctx
}
