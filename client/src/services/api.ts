import type { User } from '../models/user'

export async function saveUser(data: Partial<User>): Promise<User> {
  const stored = localStorage.getItem('user')
  const prev = stored ? JSON.parse(stored) : {}
  const user: User = {
    ...prev,
    ...data,
    id: prev.id || Date.now().toString()
  }
  localStorage.setItem('user', JSON.stringify(user))
  return user
}

export async function loadUser(): Promise<User | null> {
  const stored = localStorage.getItem('user')
  return stored ? (JSON.parse(stored) as User) : null
}
