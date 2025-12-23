import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sugu Quiz - Subae Gubae',
  description: 'Quiz game based on Ethiopian Orthodox Tewahedo Church teachings',
  themeColor: '#EEC130',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

