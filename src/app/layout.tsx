import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthContextProvider from '../../context/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'myStuff',
  description: 'myStuff',
 
}
export const viewport: Viewport = {
  
  width:"device-width",
  maximumScale:0.7,
   initialScale:1,
    userScalable:true
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
