import '../styles/globals.css'
import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/lib/auth'
import { MainNav } from '@/components/main-nav'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'EcoSort - Smart Garbage Collection',
  description: 'Upload images of waste for smart sorting and recycling recommendations.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.className
      )}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <div className="relative flex min-h-screen flex-col">
              <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
              <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-14 items-center w-full">
                  <MainNav />
                </div>
              </header>

              <div className="flex-1 relative z-10">{children}</div>
              <Toaster position='top-center' toastOptions={{ className: 'z-[2000]', duration: 5000 }} />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}