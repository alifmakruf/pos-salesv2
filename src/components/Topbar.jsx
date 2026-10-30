import React from 'react'
import { Menu, Bell, Search } from 'lucide-react'
export default function Topbar({ title, subtitle, onMenu, onNotifications }) {
  return <header className="topbar"><div className="topbar-left"><button className="icon-btn menu-trigger" onClick={onMenu}><Menu size={20}/></button><div><h1>{title}</h1><p>{subtitle}</p></div></div><div className="topbar-actions"><div className="topbar-date">Jumat, 30 Oktober 2026</div><button className="icon-btn notification-btn" onClick={onNotifications} aria-label="Lihat pesanan pending" title="Lihat pesanan pending"><Bell size={18}/><i/></button><div className="avatar top-avatar">FA</div></div></header>
}
