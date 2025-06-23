import React, { createContext, useContext, useState } from 'react'
import type { ReactNode } from "react"
import type { User } from '../models/user'
import { saveUser, loadUser } from '../services/api'

interface UserContextValue {
  user: User | null
  setUserData: (data: Partial<User>) => void
  finalizeUser: () => Promise<void>
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const setUserData = (data: Partial<User>) => {
    setUser(prev => ({ ...(prev || ({} as User)), ...data } as User))
  }

  const finalizeUser = async () => {
    if (user) {
      const saved = await saveUser(user)
      setUser(saved)
    }
  }

  // load from localStorage on mount
  useState(() => {
    loadUser().then(u => u && setUser(u))
  })

  return React.createElement(
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
