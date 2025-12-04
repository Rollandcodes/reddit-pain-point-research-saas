'use client'

import { useEffect, useState } from 'react'
import { AdminLayout, StatsCard } from './components'
import { Users, Zap, Activity, Clock } from 'lucide-react'

interface Stats {
  totalUsers: number
  totalScans: number
  activeUsers: number
  avgResponseTime: number
  successRate: number
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats')
        if (!response.ok) {
          if (response.status === 401) {
            setError('Unauthorized - Admin access required')
          } else {
            throw new Error('Failed to fetch stats')
          }
          return
        }
        const data = await response.json()
        setStats(data)
      } catch (err) {
        console.error('Failed to fetch stats:', err)
        setError('Failed to load dashboard. Please ensure you are logged in as an admin.')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome to the admin dashboard. Overview of key metrics and activity.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-sm text-gray-500">Loading dashboard...</div>
          </div>
        )}

        {/* Stats Grid */}
        {stats && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Users"
              value={stats.totalUsers.toLocaleString()}
              description="All registered users"
              icon={<Users className="h-5 w-5" />}
              trend={12}
              trendLabel="from last month"
            />

            <StatsCard
              title="Total Scans"
              value={stats.totalScans.toLocaleString()}
              description="All completed scans"
              icon={<Zap className="h-5 w-5" />}
              trend={8}
              trendLabel="from last month"
            />

            <StatsCard
              title="Active Users"
              value={stats.activeUsers.toLocaleString()}
              description="Last 30 days"
              icon={<Activity className="h-5 w-5" />}
              trend={-2}
              trendLabel="from last period"
            />

            <StatsCard
              title="Avg Response Time"
              value={`${stats.avgResponseTime}s`}
              description="Average scan duration"
              icon={<Clock className="h-5 w-5" />}
              trend={-5}
              trendLabel="improvement"
            />
          </div>
        )}

        {/* Recent Activity */}
        {stats && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
            
            <div className="mt-6 space-y-4">
              {[
                { user: 'New User', action: 'Started new scan', time: '2 minutes ago' },
                { user: 'Active User', action: 'Completed scan', time: '15 minutes ago' },
                { user: 'Another User', action: 'Signed up', time: '1 hour ago' },
                { user: 'Recent User', action: 'Started new scan', time: '3 hours ago' },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                  <div>
                    <p className="font-medium text-gray-900">{activity.user}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                  </div>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
