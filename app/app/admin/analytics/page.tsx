'use client'

import { AdminLayout, StatsCard } from '../components'
import { BarChart3, Users, TrendingUp, Clock } from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-2 text-gray-600">
            View detailed analytics and performance metrics
          </p>
        </div>

        {/* Key Metrics */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Key Metrics
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Users"
              value="1,234"
              description="Active accounts"
              trend={12}
              trendLabel="vs last month"
              icon={<Users className="h-8 w-8" />}
            />
            <StatsCard
              title="Total Scans"
              value="5,678"
              description="Completed scans"
              trend={8}
              trendLabel="vs last month"
              icon={<BarChart3 className="h-8 w-8" />}
            />
            <StatsCard
              title="Avg Scan Time"
              value="42.3s"
              description="Average duration"
              trend={-5}
              trendLabel="faster than last month"
              icon={<Clock className="h-8 w-8" />}
            />
            <StatsCard
              title="Success Rate"
              value="98.2%"
              description="Completed successfully"
              trend={2}
              trendLabel="improvement"
              icon={<TrendingUp className="h-8 w-8" />}
            />
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Scans Over Time */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Scans Over Time
            </h3>
            <div className="h-64 bg-gray-50">
              <div className="flex h-full items-center justify-center text-gray-500">
                <p className="text-sm">
                  Chart placeholder - Connect to your analytics data
                </p>
              </div>
            </div>
          </div>

          {/* Top Subreddits */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Top Subreddits
            </h3>
            <div className="space-y-4">
              {[
                { name: 'r/fitness', scans: 245, percentage: 22 },
                { name: 'r/programming', scans: 198, percentage: 18 },
                { name: 'r/cooking', scans: 176, percentage: 16 },
                { name: 'r/travel', scans: 154, percentage: 14 },
                { name: 'r/gaming', scans: 142, percentage: 13 },
              ].map((item) => (
                <div key={item.name}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {item.name}
                    </span>
                    <span className="text-sm text-gray-600">{item.scans}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Insights */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            User Insights
          </h3>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-sm text-gray-600">Avg Scans per User</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">4.6</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">User Retention (7d)</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">72%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">New Users (this week)</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">+34</p>
            </div>
          </div>
        </div>

        {/* Pain Points Summary */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Most Common Pain Points
          </h3>
          <div className="space-y-3">
            {[
              { title: 'Performance issues', count: 342, percentage: 28 },
              { title: 'User experience', count: 298, percentage: 24 },
              { title: 'Documentation', count: 267, percentage: 22 },
              { title: 'Integration', count: 204, percentage: 17 },
              { title: 'Pricing', count: 121, percentage: 9 },
            ].map((item) => (
              <div key={item.title} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {item.title}
                  </p>
                  <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-orange-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
                <p className="ml-4 text-sm text-gray-600">{item.count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
