import { useState } from 'react'
import { useStore } from '../context/StoreContext.jsx'

const initialFormState = { email: '', password: '' }

export function AuthPage() {
  const { currentUser, loginUser, logoutUser, registerUser } = useStore()
  const [registerForm, setRegisterForm] = useState(initialFormState)
  const [loginForm, setLoginForm] = useState(initialFormState)
  const [registerMessage, setRegisterMessage] = useState('')
  const [loginMessage, setLoginMessage] = useState('')

  const updateRegisterField = (event) => {
    const { name, value } = event.target
    setRegisterForm((previous) => ({ ...previous, [name]: value }))
  }

  const updateLoginField = (event) => {
    const { name, value } = event.target
    setLoginForm((previous) => ({ ...previous, [name]: value }))
  }

  const submitRegister = (event) => {
    event.preventDefault()
    const result = registerUser(registerForm.email, registerForm.password)
    setRegisterMessage(result.message)
    if (result.ok) {
      setRegisterForm(initialFormState)
    }
  }

  const submitLogin = (event) => {
    event.preventDefault()
    const result = loginUser(loginForm.email, loginForm.password)
    setLoginMessage(result.message)
    if (result.ok) {
      setLoginForm(initialFormState)
    }
  }

  return (
    <section className="page fade-up">
      <h1>Login / Register</h1>
      <p className="page-subtitle">
        This page stores users in localStorage and keeps your active session.
      </p>

      {currentUser && (
        <div className="alert">
          Logged in as <strong>{currentUser.email}</strong>
          <button className="btn btn--outline" onClick={logoutUser} type="button">
            Logout
          </button>
        </div>
      )}

      <div className="two-columns">
        <form className="card" onSubmit={submitRegister}>
          <h2>Register</h2>
          <label htmlFor="register-email">Email</label>
          <input
            id="register-email"
            name="email"
            onChange={updateRegisterField}
            placeholder="you@example.com"
            required
            type="email"
            value={registerForm.email}
          />
          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            name="password"
            onChange={updateRegisterField}
            placeholder="Enter password"
            required
            type="password"
            value={registerForm.password}
          />
          <button className="btn btn--primary" type="submit">
            Create account
          </button>
          {registerMessage && <p className="form-message">{registerMessage}</p>}
        </form>

        <form className="card" onSubmit={submitLogin}>
          <h2>Login</h2>
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            name="email"
            onChange={updateLoginField}
            placeholder="you@example.com"
            required
            type="email"
            value={loginForm.email}
          />
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            name="password"
            onChange={updateLoginField}
            placeholder="Enter password"
            required
            type="password"
            value={loginForm.password}
          />
          <button className="btn btn--primary" type="submit">
            Login
          </button>
          {loginMessage && <p className="form-message">{loginMessage}</p>}
        </form>
      </div>
    </section>
  )
}
