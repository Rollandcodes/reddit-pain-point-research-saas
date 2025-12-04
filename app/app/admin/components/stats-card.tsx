'use client'

import { ReactNode } from 'react'

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: ReactNode
  trend?: number
  trendLabel?: string
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  trendLabel,
}: StatsCardProps) {
  const isTrendPositive = trend ? trend > 0 : false

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trend !== undefined && (
              <span
                className={`text-sm font-medium ${
                  isTrendPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {isTrendPositive ? '+' : ''}{trend}%
              </span>
            )}
          </div>
          {description && (
            <p className="mt-2 text-xs text-gray-500">{description}</p>
          )}
          {trendLabel && (
            <p className="mt-1 text-xs text-gray-500">{trendLabel}</p>
          )}
        </div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
    </div>
  )
}
