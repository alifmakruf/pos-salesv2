import React, { useState } from 'react'
import { UserRound, LockKeyhole, Eye, EyeOff, Sun, Moon } from 'lucide-react'

export default function Login({ onLogin, theme = 'light', setTheme }) {
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')

  return (
    <main className="login-page login-reference">
      <button className="login-theme-toggle" type="button" onClick={() => setTheme?.(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? 'Aktifkan light mode' : 'Aktifkan dark mode'} title={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
        {theme === 'dark' ? <Sun size={18}/> : <Moon size={18}/>}<span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
      </button>
      <div className="login-brand-art" aria-label="HEXA Integra Mandiri">
        <img src="/hexa-logo.png" alt="Logo HEXA Integra Mandiri" />
      </div>

      <section className="login-card login-reference-card">
        <h1>Login</h1>
        <form onSubmit={e => { e.preventDefault(); onLogin() }}>
          <label htmlFor="login-identity">Email atau Username</label>
          <div className="login-input-wrap">
            <UserRound size={19} />
            <input id="login-identity" type="text" placeholder="example@gmail.com" autoComplete="username" />
          </div>

          <label htmlFor="login-password">Password</label>
          <div className="login-input-wrap">
            <LockKeyhole size={19} />
            <input id="login-password" type={showPassword ? 'text' : 'password'} placeholder="password" autoComplete="current-password" />
            <button className="login-password-toggle" type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}>
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>

          <button className="btn-primary login-submit" type="submit">Login</button>
        </form>
        <div className="login-or">Atau</div>
        <button className="login-google" type="button" onClick={() => setMessage('Login Google belum dihubungkan ke layanan autentikasi.')}>Google</button>
        {message && <p className="login-feedback" role="status">{message}</p>}
      </section>
    </main>
  )
}
