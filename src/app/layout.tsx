import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'RealtyMatch CRM - Real Estate Management Platform',
  description: 'Advanced real estate CRM with AI-powered matching and automation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid #334155',
            },
          }}
        />
      </body>
    </html>
  )
}
