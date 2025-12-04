'use client'

import { useState } from 'react'
import { AdminLayout, DataTable, Badge, Filters, ActionMenu } from '../components'
import { Clock, TrendingUp, AlertCircle, RotateCw, Trash2, XCircle } from 'lucide-react'

interface Scan {
  id: string
  subreddit: string
  username: string
  status: 'completed' | 'running' | 'failed' | 'queued'
  painPoints: number
  solutions: number
  completedAt: string
  duration: number
}

// Mock data - Replace with API calls
const mockScans: Scan[] = [
  {
    id: 'scan-001',
    subreddit: 'r/fitness',
    username: 'John Doe',
    status: 'completed',
    painPoints: 24,
    solutions: 18,
    completedAt: '2024-12-04T10:30:00',
    duration: 45,
  },
  {
    id: 'scan-002',
    subreddit: 'r/programming',
    username: 'Jane Smith',
    status: 'running',
    painPoints: 12,
    solutions: 8,
    completedAt: '2024-12-04T11:00:00',
    duration: 5,
  },
  {
    id: 'scan-003',
    subreddit: 'r/cooking',
    username: 'Mike Johnson',
    status: 'completed',
    painPoints: 18,
    solutions: 15,
    completedAt: '2024-12-04T09:15:00',
    duration: 35,
  },
  {
    id: 'scan-004',
    subreddit: 'r/travel',
    username: 'Sarah Williams',
    status: 'failed',
    painPoints: 0,
    solutions: 0,
    completedAt: '2024-12-04T08:45:00',
    duration: 12,
  },
  {
    id: 'scan-005',
    subreddit: 'r/gaming',
    username: 'Tom Brown',
    status: 'queued',
    painPoints: 0,
    solutions: 0,
    completedAt: '2024-12-04T11:30:00',
    duration: 0,
  },
]

const filterConfig = [
  {
    id: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { label: 'Completed', value: 'completed' },
      { label: 'Running', value: 'running' },
      { label: 'Failed', value: 'failed' },
      { label: 'Queued', value: 'queued' },
    ],
  },
  {
    id: 'completedAfter',
    label: 'Date',
    type: 'date' as const,
  },
  {
    id: 'subreddit',
    label: 'Subreddit',
    type: 'text' as const,
  },
]

export default function ScansPage() {
  const [filteredScans, setFilteredScans] = useState<Scan[]>(mockScans)
  const [filters, setFilters] = useState<Record<string, string>>({})

  const handleFiltersChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters)
    
    // Apply filters
    let result = mockScans
    
    if (newFilters.status) {
      result = result.filter((scan) => scan.status === newFilters.status)
    }
    
    if (newFilters.completedAfter) {
      result = result.filter(
        (scan) =>
          new Date(scan.completedAt) >= new Date(newFilters.completedAfter)
      )
    }
    
    if (newFilters.subreddit) {
      result = result.filter((scan) =>
        scan.subreddit
          .toLowerCase()
          .includes(newFilters.subreddit.toLowerCase())
      )
    }
    
    setFilteredScans(result)
  }

  const handleScanAction = async (scanId: string, action: string) => {
    try {
      const response = await fetch(`/api/admin/scans/${scanId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })

      if (!response.ok) {
        throw new Error('Action failed')
      }

      // Show success message (TODO: implement toast)
      console.log(`Scan action '${action}' performed successfully`)
      
      // TODO: Refresh scan data from API
    } catch (error) {
      console.error('Failed to perform action:', error)
      // TODO: Show error message
    }
  }

  const columns = [
    {
      key: 'subreddit' as const,
      label: 'Subreddit',
      render: (value: string) => (
        <span className="font-medium text-blue-600">{value}</span>
      ),
      sortable: true,
    },
    {
      key: 'username' as const,
      label: 'User',
      render: (value: string) => (
        <span className="text-sm text-gray-700">{value}</span>
      ),
      sortable: true,
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string) => (
        <Badge
          variant={
            value === 'completed'
              ? 'success'
              : value === 'failed'
              ? 'error'
              : value === 'running'
              ? 'info'
              : 'warning'
          }
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'painPoints' as const,
      label: 'Pain Points',
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-orange-500" />
          <span>{value}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'solutions' as const,
      label: 'Solutions',
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-500" />
          <span>{value}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'duration' as const,
      label: 'Duration',
      render: (value: number) => (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          {value}s
        </div>
      ),
    },
    {
      key: 'completedAt' as const,
      label: 'Completed',
      render: (value: string) => (
        <span className="text-sm text-gray-600">
          {new Date(value).toLocaleString()}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'id' as const,
      label: 'Actions',
      render: (value: string, scan: Scan) => (
        <ActionMenu
          items={[
            scan.status === 'failed' || scan.status === 'queued'
              ? {
                  label: 'Retry Scan',
                  icon: <RotateCw className="h-4 w-4" />,
                  action: 'retry',
                }
              : {
                  label: 'Cancel Scan',
                  icon: <XCircle className="h-4 w-4" />,
                  action: 'cancel',
                  variant: 'warning' as const,
                },
            {
              label: 'Delete Scan',
              icon: <Trash2 className="h-4 w-4" />,
              action: 'delete',
              variant: 'danger' as const,
            },
          ]}
          onAction={(action) => handleScanAction(scan.id, action)}
          disabled={scan.status === 'running'}
        />
      ),
    },
  ]

  const stats = {
    total: mockScans.length,
    completed: mockScans.filter((s) => s.status === 'completed').length,
    running: mockScans.filter((s) => s.status === 'running').length,
    failed: mockScans.filter((s) => s.status === 'failed').length,
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Scans</h1>
          <p className="mt-2 text-gray-600">
            Monitor and manage all Reddit scans ({filteredScans.length} total)
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs font-medium text-gray-600">Total</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs font-medium text-gray-600">Completed</p>
            <p className="mt-1 text-2xl font-bold text-green-600">
              {stats.completed}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs font-medium text-gray-600">Running</p>
            <p className="mt-1 text-2xl font-bold text-blue-600">
              {stats.running}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs font-medium text-gray-600">Failed</p>
            <p className="mt-1 text-2xl font-bold text-red-600">
              {stats.failed}
            </p>
          </div>
        </div>

        {/* Filters */}
        <Filters config={filterConfig} onFiltersChange={handleFiltersChange} />

        {/* Table */}
        <DataTable<Scan>
          columns={columns}
          data={filteredScans}
          searchPlaceholder="Search by subreddit or username..."
          itemsPerPage={10}
        />
      </div>
    </AdminLayout>
  )
}
