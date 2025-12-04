'use client'

import { useState } from 'react'
import { AdminLayout, DataTable, Badge, Filters, ActionMenu } from '../components'
import { Mail, User, Calendar, Trash2, Lock, Unlock, Crown } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  status: 'active' | 'inactive' | 'suspended'
  scans: number
  joinedDate: string
  lastActive: string
}

// Mock data - Replace with API calls
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'active',
    scans: 12,
    joinedDate: '2024-01-15',
    lastActive: '2024-12-04',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    status: 'active',
    scans: 8,
    joinedDate: '2024-02-20',
    lastActive: '2024-12-03',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    status: 'inactive',
    scans: 3,
    joinedDate: '2024-03-10',
    lastActive: '2024-11-15',
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    status: 'active',
    scans: 25,
    joinedDate: '2023-12-01',
    lastActive: '2024-12-04',
  },
  {
    id: '5',
    name: 'Tom Brown',
    email: 'tom@example.com',
    status: 'suspended',
    scans: 5,
    joinedDate: '2024-04-05',
    lastActive: '2024-11-20',
  },
]

const filterConfig = [
  {
    id: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
      { label: 'Suspended', value: 'suspended' },
    ],
  },
  {
    id: 'joinedAfter',
    label: 'Joined After',
    type: 'date' as const,
  },
]

export default function UsersPage() {
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers)
  const [filters, setFilters] = useState<Record<string, string>>({})

  const handleFiltersChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters)
    
    // Apply filters
    let result = mockUsers
    
    if (newFilters.status) {
      result = result.filter((user) => user.status === newFilters.status)
    }
    
    if (newFilters.joinedAfter) {
      result = result.filter(
        (user) => new Date(user.joinedDate) >= new Date(newFilters.joinedAfter)
      )
    }
    
    setFilteredUsers(result)
  }

  const handleUserAction = async (userId: string, action: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })

      if (!response.ok) {
        throw new Error('Action failed')
      }

      // Show success message (TODO: implement toast)
      console.log(`User action '${action}' performed successfully`)
      
      // TODO: Refresh user data from API
    } catch (error) {
      console.error('Failed to perform action:', error)
      // TODO: Show error message
    }
  }

  const columns = [
    {
      key: 'name' as const,
      label: 'Name',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-400" />
          <span className="font-medium">{value}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'email' as const,
      label: 'Email',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-400" />
          <a href={`mailto:${value}`} className="text-blue-600 hover:underline">
            {value}
          </a>
        </div>
      ),
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string) => (
        <Badge
          variant={
            value === 'active'
              ? 'success'
              : value === 'suspended'
              ? 'error'
              : 'warning'
          }
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'scans' as const,
      label: 'Scans',
      render: (value: number) => (
        <span className="font-medium">{value}</span>
      ),
      sortable: true,
    },
    {
      key: 'joinedDate' as const,
      label: 'Joined',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          {new Date(value).toLocaleDateString()}
        </div>
      ),
      sortable: true,
    },
    {
      key: 'lastActive' as const,
      label: 'Last Active',
      render: (value: string) => {
        const daysAgo = Math.floor(
          (Date.now() - new Date(value).getTime()) / (1000 * 60 * 60 * 24)
        )
        return <span className="text-sm text-gray-600">{daysAgo}d ago</span>
      },
    },
    {
      key: 'id' as const,
      label: 'Actions',
      render: (value: string, user: User) => (
        <ActionMenu
          items={[
            {
              label: user.status === 'suspended' ? 'Unsuspend' : 'Suspend',
              icon: user.status === 'suspended' ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />,
              action: user.status === 'suspended' ? 'unsuspend' : 'suspend',
              variant: 'warning',
            },
            {
              label: 'Promote to Admin',
              icon: <Crown className="h-4 w-4" />,
              action: 'promote',
            },
            {
              label: 'Delete User',
              icon: <Trash2 className="h-4 w-4" />,
              action: 'delete',
              variant: 'danger',
            },
          ]}
          onAction={(action) => handleUserAction(user.id, action)}
        />
      ),
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="mt-2 text-gray-600">
            Manage and monitor user accounts ({filteredUsers.length} total)
          </p>
        </div>

        {/* Filters */}
        <Filters config={filterConfig} onFiltersChange={handleFiltersChange} />

        {/* Table */}
        <DataTable<User>
          columns={columns}
          data={filteredUsers}
          searchPlaceholder="Search by name or email..."
          itemsPerPage={10}
        />
      </div>
    </AdminLayout>
  )
}
