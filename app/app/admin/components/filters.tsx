'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface FilterConfig {
  id: string
  label: string
  type: 'select' | 'date' | 'text'
  options?: Array<{ label: string; value: string }>
}

interface FiltersProps {
  config: FilterConfig[]
  onFiltersChange?: (filters: Record<string, string>) => void
}

export function Filters({ config, onFiltersChange }: FiltersProps) {
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [isOpen, setIsOpen] = useState(false)

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  const handleFilterChange = (id: string, value: string) => {
    const newFilters = { ...filters, [id]: value }
    setFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const clearFilters = () => {
    setFilters({})
    onFiltersChange?.({})
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Filters</h3>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-xs text-blue-600 hover:text-blue-700"
          >
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {config.map((filter) => (
          <div key={filter.id}>
            <label className="mb-2 block text-xs font-medium text-gray-700">
              {filter.label}
            </label>

            {filter.type === 'select' && (
              <select
                value={filters[filter.id] || ''}
                onChange={(e) =>
                  handleFilterChange(filter.id, e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All</option>
                {filter.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}

            {filter.type === 'date' && (
              <input
                type="date"
                value={filters[filter.id] || ''}
                onChange={(e) =>
                  handleFilterChange(filter.id, e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            )}

            {filter.type === 'text' && (
              <input
                type="text"
                value={filters[filter.id] || ''}
                onChange={(e) =>
                  handleFilterChange(filter.id, e.target.value)
                }
                placeholder="Search..."
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
