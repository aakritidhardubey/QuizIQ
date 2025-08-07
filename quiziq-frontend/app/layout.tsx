import './globals.css'
import { Poppins } from 'next/font/google'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

const poppins = Poppins({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'] 
})

export const metadata = {
  title: 'QuizIQ - Master Your Aptitude',
  description: 'Adaptive aptitude quiz platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${poppins.className} bg-background min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}