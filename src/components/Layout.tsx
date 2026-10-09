import { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import NavBar from './NavBar'
import Footer from './Footer'

export default function Layout({ children }: { children?: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-warm-ivory">
      <Header />
      <NavBar />
      <main className="flex-1 container-game py-6">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  )
}