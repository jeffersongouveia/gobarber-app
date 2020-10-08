import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from 'react'
import AsyncStorage from '@react-native-community/async-storage'

import api from '../services/api'

interface SignInProps {
  email: string
  password: string
}

interface SessionUser {
  id: string
  name: string
  email: string
  avatar: string
}

interface SessionResponse {
  user: SessionUser
  token: string
}

interface AuthContextProps {
  user: SessionUser
  loading: boolean
  signIn(props: SignInProps): Promise<void>
  signOut(): void
}

const initialValue = {} as AuthContextProps
export const Auth = createContext<AuthContextProps>(initialValue)

export const AuthProvider: React.FC = ({ children }) => {
  const [session, setSession] = useState<SessionResponse>({} as SessionResponse)
  const [loading, setLoading] = useState(true)

  const signIn = useCallback(async (params) => {
    const { data } = await api.post<SessionResponse>('/sessions', params)

    setSession(data)
    await AsyncStorage.multiSet([
      ['@GoBarber:token', data.token],
      ['@GoBarber:user', JSON.stringify(data.user)],
    ])
  }, [])

  const signOut = useCallback(async () => {
    setSession({} as SessionResponse)

    await AsyncStorage.multiRemove(['@GoBarber:token', '@GoBarber:user'])
  }, [])

  useEffect(() => {
    async function loadStorageData(): Promise<void> {
      const [token, user] = await AsyncStorage.multiGet([
        '@GoBarber:token',
        '@GoBarber:user',
      ])

      if (token[1] && user[1]) {
        setSession({
          token: token[1],
          user: JSON.parse(user[1]),
        })
      }

      setLoading(false)
    }

    loadStorageData()
  }, [])

  return (
    <Auth.Provider value={{ user: session.user, loading, signIn, signOut }}>
      {children}
    </Auth.Provider>
  )
}

export function useAuth(): AuthContextProps {
  const context = useContext(Auth)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
