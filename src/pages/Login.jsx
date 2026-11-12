import React, { useState } from 'react'
import { User, Lock, Eye, EyeOff, Sun, Moon } from 'lucide-react'

/* ========================================================
   PARAMETER KUSTOMISASI LOGIN (Bisa Anda sesuaikan sendiri)
   ======================================================== */
export const LOGIN_CONFIG = {
  title: 'Sign in to QUARZA',
  subtitle: 'Masuk ke QUARZA by HEXA untuk mengelola pesanan, stok, dan pelanggan.',
  buttonText: 'Get Started',
  showSocialLogin: true,              // Tampilkan opsi login sosial (Google)
  socialButtonText: 'Sign in with Google', // Teks tombol Google (isi '' jika ingin ikon Google saja)
  inputPlaceholder: 'Username / Email', // Placeholder input login
  showForgotLink: true,               // Tampilkan teks 'Forgot password?'
  defaultUsername: 'firman@quarza.com', // Nilai awal username/email untuk demo cepat
  logoPath: '/quarza-logo.webp',     // Path logo QUARZA (WebP ~37KB vs PNG 773KB)
  logoSize: 52,                       // Parameter: Ukuran logo dalam pixel (default 50-52px)
  logoMarginBottom: 16                // Parameter: Jarak bawah logo ke judul (px)
}

export default function Login({ onLogin, theme = 'light', setTheme }) {
  const [username, setUsername] = useState(LOGIN_CONFIG.defaultUsername)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [feedback, setFeedback] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin()
  }

  const handleForgot = () => {
    setFeedback('Tautan reset password telah dikirimkan ke email administrator.')
    setTimeout(() => setFeedback(''), 4000)
  }

  return (
    <main className="sky-login-page">
      {/* Background Orbits & Cloud Atmosphere (Warna tematik QUARZA) */}
      <div className="sky-bg-atmosphere" aria-hidden="true">
        <div className="sky-cloud-base" />
        <div className="sky-cloud-puff puff-1" />
        <div className="sky-cloud-puff puff-2" />
        <div className="sky-orbit orbit-outer" />
        <div className="sky-orbit orbit-inner" />
      </div>

      {/* Theme Toggle (Pojok kanan atas) */}
      <button
        className="sky-theme-toggle"
        type="button"
        onClick={() => setTheme?.(theme === 'dark' ? 'light' : 'dark')}
        aria-label="Ganti mode tampilan"
        title={theme === 'dark' ? 'Ganti ke Light Mode' : 'Ganti ke Dark Mode'}
      >
        {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
      </button>

      {/* Floating Centered Card sesuai referensi gambar */}
      <div className="sky-login-card">
        {/* Top Logo QUARZA (Bersih tanpa kotak container) */}
        <div
          className="sky-login-logo-wrap"
          style={{ marginBottom: `${LOGIN_CONFIG.logoMarginBottom}px` }}
          title="QUARZA by HEXA"
        >
          <img
            src={LOGIN_CONFIG.logoPath}
            alt="QUARZA Logo"
            className="sky-login-logo"
            style={{ width: `${LOGIN_CONFIG.logoSize}px`, height: `${LOGIN_CONFIG.logoSize}px` }}
            fetchpriority="high"
            decoding="sync"
          />
        </div>

        {/* Heading & Subtitle */}
        <h1 className="sky-login-title">{LOGIN_CONFIG.title}</h1>
        <p className="sky-login-subtitle">{LOGIN_CONFIG.subtitle}</p>

        {/* Form Input */}
        <form className="sky-login-form" onSubmit={handleSubmit}>
          {/* Username / Email Input */}
          <div className="sky-input-box">
            <User size={17} className="sky-input-icon" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={LOGIN_CONFIG.inputPlaceholder}
              required
              autoComplete="username"
            />
          </div>

          {/* Password Input */}
          <div className="sky-input-box">
            <Lock size={17} className="sky-input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="sky-pwd-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Forgot Password Link */}
          {LOGIN_CONFIG.showForgotLink && (
            <div className="sky-forgot-wrap">
              <button type="button" className="sky-forgot-link" onClick={handleForgot}>
                Forgot password?
              </button>
            </div>
          )}

          {/* Primary Action Button */}
          <button type="submit" className="sky-btn-primary">
            {LOGIN_CONFIG.buttonText}
          </button>
        </form>

        {/* Feedback info */}
        {feedback && <div className="sky-login-feedback">{feedback}</div>}

        {/* Social Login Section */}
        {LOGIN_CONFIG.showSocialLogin && (
          <div className="sky-social-section">
            <div className="sky-divider">
              <span className="sky-divider-dots" />
              <span className="sky-divider-text">Or sign in with</span>
              <span className="sky-divider-dots" />
            </div>

            <div className="sky-social-buttons">
              {/* Google Button */}
              <button
                type="button"
                className="sky-social-btn"
                onClick={onLogin}
                title="Sign in with Google"
                aria-label="Sign in with Google"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                {LOGIN_CONFIG.socialButtonText && <span>{LOGIN_CONFIG.socialButtonText}</span>}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
