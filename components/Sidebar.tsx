'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  HomeIcon,
  CubeIcon,
  FolderIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'
import {
  HomeIcon as HomeIconSolid,
  CubeIcon as CubeIconSolid,
  FolderIcon as FolderIconSolid,
  CurrencyDollarIcon as CurrencyDollarIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
} from '@heroicons/react/24/solid'

const menuItems = [
  { 
    href: '/', 
    label: 'Dashboard', 
    icon: HomeIcon,
    iconSolid: HomeIconSolid 
  },
  { 
    href: '/inventory', 
    label: 'Inventory', 
    icon: CubeIcon,
    iconSolid: CubeIconSolid 
  },
  { 
    href: '/categories', 
    label: 'Categories', 
    icon: FolderIcon,
    iconSolid: FolderIconSolid 
  },
  { 
    href: '/transactions', 
    label: 'Transactions', 
    icon: CurrencyDollarIcon,
    iconSolid: CurrencyDollarIconSolid 
  },
  { 
    href: '/settings', 
    label: 'Settings', 
    icon: Cog6ToothIcon,
    iconSolid: Cog6ToothIconSolid 
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-30">
      <div className="flex flex-col h-full">
        {/* Logo/Brand */}
        <div className="px-4 py-4 border-b border-gray-200 bg-white">
          <Link href="/" className="flex items-center text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-1">
            <CubeIcon className="h-6 w-6 mr-2 text-blue-600" />
            ItemHive
          </Link>
          <p className="text-xs text-gray-500 ml-8">
            Central hub for all your inventory
          </p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              const IconComponent = isActive ? item.iconSolid : item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                      ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <IconComponent className={`h-5 w-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
