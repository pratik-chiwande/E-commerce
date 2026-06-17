import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // ✅ persist login across refresh
    const stored = localStorage.getItem('trendkart_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('trendkart_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('trendkart_user')
  }

  const updateProfileImage = (imageUrl) => {
    const updated = { ...user, profileImage: imageUrl }
    setUser(updated)
    localStorage.setItem('trendkart_user', JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfileImage }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}