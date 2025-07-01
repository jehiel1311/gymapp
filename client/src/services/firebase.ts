import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { firebaseConfig } from '../config/firebaseConfig'

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const login = () => signInWithPopup(auth, new GoogleAuthProvider())
export const logout = () => signOut(auth)
