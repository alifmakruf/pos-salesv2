import React, { useEffect, useRef, useState } from 'react'
import { LayoutDashboard, ClipboardList, Settings, LogOut, Sun, Moon, X, UserRound, Trash2, AlertTriangle } from 'lucide-react'

export default function Sidebar({ onLogout, page, setPage, drafts = [], activeDraftId, openDraft, onDeleteDraft, theme, setTheme, open, setOpen }) {
  const [holdingId, setHoldingId] = useState(null)
  const [holdReady, setHoldReady] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const holdTimer = useRef(null)
  const suppressClick = useRef(false)
  const suppressTimer = useRef(null)

  useEffect(() => () => {
    if (holdTimer.current) clearTimeout(holdTimer.current)
    if (suppressTimer.current) clearTimeout(suppressTimer.current)
  }, [])

  const startHold = (event, id) => {
    if (event.button !== undefined && event.button !== 0) return
    if (holdTimer.current) clearTimeout(holdTimer.current)
    suppressClick.current = false
    setHoldingId(id)
    setHoldReady(false)
    try { event.currentTarget.setPointerCapture(event.pointerId) } catch {}
    holdTimer.current = setTimeout(() => setHoldReady(true), 1000)
  }

  const endHold = (id) => {
    if (holdingId !== id) return
    if (holdTimer.current) clearTimeout(holdTimer.current)
    holdTimer.current = null
    if (holdReady) {
      suppressClick.current = true
      if (suppressTimer.current) clearTimeout(suppressTimer.current)
      suppressTimer.current = setTimeout(() => { suppressClick.current = false }, 350)
      setDeleteTarget(drafts.find(d => d.id === id) || null)
    }
    setHoldingId(null)
    setHoldReady(false)
  }

  const cancelHold = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current)
    holdTimer.current = null
    setHoldingId(null)
    setHoldReady(false)
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    suppressClick.current = false
    if (suppressTimer.current) clearTimeout(suppressTimer.current)
    onDeleteDraft?.(deleteTarget.id)
    setDeleteTarget(null)
  }

  const cancelDelete = () => {
    suppressClick.current = false
    if (suppressTimer.current) clearTimeout(suppressTimer.current)
    setDeleteTarget(null)
  }

  return <>
    {open && <button className="sidebar-backdrop" onClick={() => setOpen(false)} aria-label="Tutup menu" />}
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="brand-row"><div className="brand-mark">H</div><div><div className="brand-name">HEXA</div><div className="brand-sub">FURNITURE POS</div></div><button className="icon-btn mobile-close" onClick={() => setOpen(false)}><X size={18}/></button></div>
      <div className="side-caption">WORKSPACE</div>
      <nav className="side-nav">
        <button className={`nav-link ${page === 'dashboard' ? 'active' : ''}`} onClick={() => { setPage('dashboard'); setOpen(false) }}><LayoutDashboard size={18}/><span>Beranda</span></button>
        <button className={`nav-link ${page === 'orders' ? 'active' : ''}`} onClick={() => { setPage('orders'); setOpen(false) }}><ClipboardList size={18}/><span>Pesanan Saya</span></button>
      </nav>
      <div className="side-caption draft-side-caption">PESANAN AKTIF <span className="nav-count">{drafts.length}</span></div>
      <div className="side-draft-list">
        {drafts.map((draft,index)=><button
          key={draft.id}
          title={`${draft.customer.name || 'Pesanan baru'} — hold to delete`}
          className={`nav-link draft-nav-link ${activeDraftId === draft.id ? 'active' : ''} ${holdingId === draft.id ? 'draft-holding' : ''}`}
          onClick={()=>{ if (suppressClick.current) { suppressClick.current = false; return } openDraft(draft.id);setOpen(false) }}
          onPointerDown={event=>startHold(event,draft.id)}
          onPointerUp={()=>endHold(draft.id)}
          onPointerLeave={cancelHold}
          onPointerCancel={cancelHold}
          onContextMenu={event=>event.preventDefault()}
          onDragStart={event=>event.preventDefault()}
          aria-label={`${draft.customer.name || `Pesanan Baru ${index+1}`}. Hold to delete, tahan 1 detik untuk menghapus`}
        >
          {holdingId === draft.id && <span className={`draft-hold-fill ${holdReady ? 'complete' : ''}`} />}
          <UserRound size={17}/><span className="draft-label-wrap"><b>{draft.customer.name || `Pesanan Baru ${index+1}`}</b><em>Hold to delete</em></span><small>{draft.cart.reduce((n,item)=>n+item.qty,0) || '—'}</small>
        </button>)}
        {!drafts.length && <div className="draft-empty-hint">Belum ada pesanan aktif</div>}
      </div>
      <div className="sidebar-bottom"><button className="nav-link" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title="Ganti tema"><Settings size={18}/><span>Pengaturan / Tema</span></button><div className="theme-switch"><span>Tampilan</span><button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Ganti tema">{theme === 'dark' ? <Sun size={16}/> : <Moon size={16}/>}<span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span></button></div><div className="profile-mini"><div className="avatar">FA</div><div className="profile-copy"><b>Firman Alif</b><span>Sales</span></div><button className="icon-btn" onClick={onLogout} aria-label="Keluar" title="Keluar"><LogOut size={16}/></button></div></div>
    </aside>
    {deleteTarget && <div className="modal-overlay draft-delete-overlay" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)cancelDelete()}}>
      <section className="modal draft-delete-modal" role="alertdialog" aria-modal="true" aria-labelledby="draft-delete-title" aria-describedby="draft-delete-description">
        <div className="draft-delete-icon"><AlertTriangle size={22}/></div>
        <span className="eyebrow">HAPUS PESANAN</span>
        <h2 id="draft-delete-title">Hapus pesanan ini?</h2>
        <p id="draft-delete-description">Pesanan <b>{deleteTarget.customer.name || 'Pesanan baru'}</b> akan dihapus beserta seluruh item di keranjangnya. Tindakan ini tidak dapat dibatalkan.</p>
        <div className="draft-delete-actions">
          <button className="btn-outline" onClick={cancelDelete}>Batal</button>
          <button className="btn-danger" onClick={confirmDelete}><Trash2 size={15}/> Hapus Pesanan</button>
        </div>
      </section>
    </div>}
  </>
}
