import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Task Tracker',
  description: 'Created by Sanyam Jain',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
