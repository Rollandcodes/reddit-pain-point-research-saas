import { Header } from "@/components/layout/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <main className="container py-8">
        {children}
      </main>
    </div>
  )
}
