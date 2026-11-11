import React, { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, Sun, Moon } from 'lucide-react'

/* ========================================================
   PARAMETER KUSTOMISASI LOGIN (Bisa Anda sesuaikan sendiri)
   ======================================================== */
export const LOGIN_CONFIG = {
  title: 'Sign in with email',
  subtitle: 'Masuk ke QUARZA by HEXA untuk mengelola pesanan, stok, dan pelanggan.',
  buttonText: 'Get Started',
  showSocialLogin: true,          // Tampilkan deretan tombol Google, Facebook, Apple
  showForgotLink: true,           // Tampilkan teks 'Forgot password?'
  defaultEmail: 'firman@quarza.com', // Nilai awal email untuk demo cepat
  logoPath: '/quarza-logo.webp', // Path logo QUARZA (WebP ~37KB vs PNG 773KB)
  logoSize: 52,                   // Parameter: Ukuran logo dalam pixel (default 50-52px)
  logoMarginBottom: 16            // Parameter: Jarak bawah logo ke judul (px)
}

export default function Login({ onLogin, theme = 'light', setTheme }) {
  const [email, setEmail] = useState(LOGIN_CONFIG.defaultEmail)
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
          {/* Email Input */}
          <div className="sky-input-box">
            <Mail size={17} className="sky-input-icon" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              autoComplete="email"
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
              </button>

              {/* Facebook Button */}
              <button
                type="button"
                className="sky-social-btn"
                onClick={onLogin}
                title="Sign in with Facebook"
                aria-label="Sign in with Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>

              {/* Apple Button */}
              <button
                type="button"
                className="sky-social-btn"
                onClick={onLogin}
                title="Sign in with Apple"
                aria-label="Sign in with Apple"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.86c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.8 1.44-.6.69-1.12 1.82-1 2.92 1.07.08 2.15-.52 2.81-1.32z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
