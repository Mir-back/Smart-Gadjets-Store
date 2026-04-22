import { Route, Routes } from 'react-router-dom'
import { Navbar } from './components/Navbar.jsx'
import { AboutPage } from './pages/AboutPage.jsx'
import { AdminPage } from './pages/AdminPage.jsx'
import { AuthPage } from './pages/AuthPage.jsx'
import { CartPage } from './pages/CartPage.jsx'
import { FavoritesPage } from './pages/FavoritesPage.jsx'
import { HomePage } from './pages/HomePage.jsx'

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
