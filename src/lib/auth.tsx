'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
    id: string
    name: string
    email: string
}

interface AuthContextType {
    user: User | null
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    signup: (name: string, email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const router = useRouter()

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await fetch('http://localhost:5000/auth/user', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    console.error('Auth check failed, response status:', response.status);
                }
            }

        } catch (error) {
            console.error('Auth check error:', error);
        }
    };


    const login = async (email: string, password: string) => {
        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                console.log('Token saved:', data.token);
                await checkAuth();

                router.push('/')
            } else {
                console.error('Login failed')
            }
        } catch (error) {
            console.error('Login error:', error)
        }
    }

    const logout = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/auth/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if (response.ok) {
            setUser(null)
            localStorage.removeItem('token');
            router.push('/login')
        }
    }

    const signup = async (name: string, email: string, password: string) => {
        try {
            const response = await fetch('http://localhost:5000/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            })
            if (response.ok) {
                router.push('/login')
            } else {
                console.error('Signup failed')
            }
        } catch (error) {
            console.error('Signup error:', error)
        }
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, signup }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}