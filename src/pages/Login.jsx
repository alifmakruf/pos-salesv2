import React, { useState } from 'react'
import { UserRound, LockKeyhole, Eye, EyeOff, Sun, Moon, ArrowRight, Sparkles, ShieldCheck, CircleCheck } from 'lucide-react'

export default function Login({ onLogin, theme = 'light', setTheme }) {
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')

  return (
    <main className="login-page login-reference login-creative">
      <button className="login-theme-toggle" type="button" onClick={() => setTheme?.(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? 'Aktifkan light mode' : 'Aktifkan dark mode'} title={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
        {theme === 'dark' ? <Sun size={17}/> : <Moon size={17}/>}<span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
      </button>

      <section className="login-showcase">
        <div className="login-showcase-orbit orbit-one"/><div className="login-showcase-orbit orbit-two"/>
        <div className="login-brand-art"><img src="/hexa-logo.png" alt="Logo HEXA Integra Mandiri" /></div>
        <div className="login-showcase-copy">
          <span className="login-kicker"><Sparkles size={13}/> SALES WORKSPACE</span>
          <h2>Make every<br/><em>interaction</em> count.</h2>
          <p>Kelola pesanan pelanggan dengan alur kerja yang lebih rapi, cepat, dan terarah.</p>
        </div>
        <div className="login-showcase-foot"><span><CircleCheck size={14}/> Order management</span><i/><span>HEXA Integra Mandiri</span></div>
        <div className="login-float-card"><span className="login-float-icon"><ShieldCheck size={17}/></span><div><b>Workspace aman</b><small>Akses khusus tim sales</small></div><span className="login-float-dot"/></div>
      </section>

      <section className="login-card login-reference-card login-creative-card">
        <div className="login-card-top"><span className="login-card-mark">H</span><span>HEXA <b>SALES</b></span><span className="login-secure"><ShieldCheck size={13}/> SECURE ACCESS</span></div>
        <div className="login-form-intro"><span className="login-welcome">WELCOME BACK</span><h1>Sign in<span>.</span></h1><p>Masuk ke akun kamu untuk melanjutkan pekerjaan.</p></div>
        <form onSubmit={e => { e.preventDefault(); onLogin() }}>
          <label htmlFor="login-identity">Email atau Username</label>
          <div className="login-input-wrap"><UserRound size={18}/><input id="login-identity" type="text" placeholder="nama@perusahaan.com" autoComplete="username" /></div>
          <div className="login-password-label"><label htmlFor="login-password">Password</label><button type="button" onClick={() => setMessage('Jika lupa password, hubungi administrator untuk bantuan akses.')}>Lupa password?</button></div>
          <div className="login-input-wrap"><LockKeyhole size={18}/><input id="login-password" type={showPassword ? 'text' : 'password'} placeholder="Masukkan password" autoComplete="current-password"/><button className="login-password-toggle" type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}>{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div>
          <button className="btn-primary login-submit" type="submit"><span>Masuk ke Dashboard</span><ArrowRight size={17}/></button>
        </form>
        <div className="login-form-note"><ShieldCheck size={14}/> Akun kamu dilindungi oleh sistem akses HEXA.</div>
        {message && <p className="login-feedback" role="status">{message}</p>}
        <div className="login-card-footer">© 2026 HEXA Integra Mandiri <span>•</span> Sales Portal</div>
      </section>
    </main>
  )
}
