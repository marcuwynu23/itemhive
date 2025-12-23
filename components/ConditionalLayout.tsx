'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()
  const isAuthPage = pathname?.startsWith('/auth')

  useEffect(() => {
    // Redirect to login if not authenticated and not on auth page
    if (status === 'unauthenticated' && !isAuthPage) {
      router.push('/auth/login')
    }
  }, [status, isAuthPage, router])

  if (isAuthPage) {
    return <>{children}</>
  }

  // Show loading state while checking session
  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render protected content if not authenticated
  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        {/* Top Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="w-full px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
