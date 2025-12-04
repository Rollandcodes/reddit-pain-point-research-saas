'use client'

import { useState, useRef, useEffect } from 'react'
import { MoreVertical, Trash2, Lock, Unlock, Crown } from 'lucide-react'

interface ActionMenuItem {
  label: string
  icon: React.ReactNode
  action: string
  variant?: 'default' | 'danger' | 'warning'
}

interface ActionMenuProps {
  items: ActionMenuItem[]
  onAction: (action: string) => Promise<void> | void
  disabled?: boolean
}

export function ActionMenu({ items, onAction, disabled }: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleAction = async (action: string) => {
    setIsLoading(true)
    try {
      await onAction(action)
      setIsOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || isLoading}
        title="Actions menu"
        aria-label="Actions menu"
        className="inline-flex items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 min-w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
          {items.map((item) => (
            <button
              key={item.action}
              onClick={() => handleAction(item.action)}
              disabled={isLoading}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm first:rounded-t-lg last:rounded-b-lg hover:bg-gray-50 disabled:opacity-50 ${
                item.variant === 'danger'
                  ? 'text-red-600 hover:bg-red-50'
                  : item.variant === 'warning'
                    ? 'text-yellow-600 hover:bg-yellow-50'
                    : 'text-gray-700'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
