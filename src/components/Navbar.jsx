import { NavLink } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/admin', label: 'Admin Panel' },
  { to: '/auth', label: 'Login / Register' },
]

export function Navbar() {
  const {
    cartCount,
    favorites,
    currentUser,
    theme,
    toggleTheme,
    logoutUser,
  } = useStore()

  return (
    <header className="navbar">
      <div className="navbar__inner container">
        <NavLink className="brand" to="/">
          <span className="brand__mark">SGS</span>
          <span>Smart Gadgets Store</span>
        </NavLink>

        <nav className="nav-links">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link--active' : 'nav-link'
              }
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link--active' : 'nav-link'
            }
            to="/favorites"
          >
            Favorites ({favorites.length})
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link--active' : 'nav-link'
            }
            to="/cart"
          >
            Cart ({cartCount})
          </NavLink>
        </nav>

        <div className="nav-actions">
          <button className="btn btn--ghost" onClick={toggleTheme} type="button">
            {theme === 'light' ? 'Dark Theme' : 'Light Theme'}
          </button>
          <span className="user-pill">
            {currentUser ? currentUser.email : 'Guest'}
          </span>
          {currentUser && (
            <button className="btn btn--outline" onClick={logoutUser} type="button">
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
