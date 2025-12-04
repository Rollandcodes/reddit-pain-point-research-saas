import AdminPageClient from './page-client'

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Manage users, scans, and analytics',
}

export default function AdminPage() {
  return <AdminPageClient />
}
