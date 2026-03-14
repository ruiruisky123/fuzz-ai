import { UserProvider } from '@/contexts/UserContext'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <div style={{ minHeight: '100vh', background: '#FEFCF5' }}>
        {children}
      </div>
    </UserProvider>
  )
}
