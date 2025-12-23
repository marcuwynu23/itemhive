'use client'

import { useSession, signOut } from 'next-auth/react'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const handleProfileClick = () => {
    if (session) {
      router.push('/profile')
    } else {
      router.push('/auth/login')
    }
  }

  return (
    <nav className="h-16 bg-white border-b border-gray-200 flex items-center px-6 shadow-sm">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-4">
          {/* Breadcrumb or page title can go here */}
        </div>
        <div className="flex items-center space-x-4">
          {status === 'loading' ? (
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
          ) : session ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-700 hidden md:block">
                {session.user?.name || session.user?.email}
              </span>
              <div className="relative group">
                <button
                  onClick={handleProfileClick}
                  className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
                  title="Profile"
                >
                  <UserCircleIcon className="h-6 w-6 text-gray-600" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: '/auth/login' })}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="btn btn-primary text-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

