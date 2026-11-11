import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode><BrowserRouter><App /></BrowserRouter></React.StrictMode>
)

// Hapus splash screen setelah React selesai mount pertama kali.
// requestAnimationFrame memastikan DOM sudah dicat ke layar sebelum kita hide splash.
requestAnimationFrame(() => {
  const splash = document.getElementById('splash')
  if (!splash) return
  splash.classList.add('hide')
  // Hapus dari DOM setelah transisi selesai (200ms sesuai CSS transition)
  setTimeout(() => splash.remove(), 220)
})
