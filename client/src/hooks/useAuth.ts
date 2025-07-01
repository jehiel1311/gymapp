import { useEffect, useState } from 'react'
import { auth, login, logout } from '../services/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(auth.currentUser)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser)
    return unsub
  }, [])

  return { user, login, logout }
}
