'use client'
import Link from 'next/link'
import { Brain, User, LogOut, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem('user')
    setIsLoggedIn(!!user)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    window.location.href = '/'
  }

  return (
    <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Brain className="w-8 h-8" />
            <span className="text-2xl font-bold">QuizIQ</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="hover:text-gray-200 transition font-medium">
                  Dashboard
                </Link>
                <Link href="/quiz" className="hover:text-gray-200 transition font-medium">
                  Start Quiz
                </Link>
                <Link href="/profile" className="hover:text-gray-200 transition">
                  <User className="w-5 h-5" />
                </Link>
                <button onClick={handleLogout} className="hover:text-gray-200 transition">
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-gray-200 transition font-medium">
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-dark transition font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-800">
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="block py-2 hover:text-gray-200">Dashboard</Link>
                <Link href="/quiz" className="block py-2 hover:text-gray-200">Start Quiz</Link>
                <Link href="/profile" className="block py-2 hover:text-gray-200">Profile</Link>
                <button onClick={handleLogout} className="block py-2 hover:text-gray-200 w-full text-left">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block py-2 hover:text-gray-200">Login</Link>
                <Link href="/signup" className="block py-2 hover:text-gray-200">Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}