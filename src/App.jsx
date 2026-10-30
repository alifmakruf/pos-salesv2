import React, { useState } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Catalog from './pages/Catalog'
import Orders from './pages/Orders'
import { initialOrders } from './data/mockData'

export default function App() {
 const [theme,setTheme]=useState('dark'); const [loggedIn,setLoggedIn]=useState(false); const [sidebarOpen,setSidebarOpen]=useState(false); const [orders,setOrders]=useState(initialOrders); const [success,setSuccess]=useState(null)
 const [drafts,setDrafts]=useState([]); const [activeDraftId,setActiveDraftId]=useState(null)
 const navigate=useNavigate(); const location=useLocation()
 const activeDraft=drafts.find(d=>d.id===activeDraftId) || null
 const createDraft=()=>{const id=`DRAFT-${Date.now()}`;setDrafts(old=>[...old,{id,customer:{name:'',phone:''},cart:[],createdAt:Date.now()}]);setActiveDraftId(id);navigate('/catalog')}
 const updateDraft=(key,value)=>setDrafts(old=>old.map(d=>d.id===activeDraftId?{...d,[key]:value}:d))
 const setCart=fn=>setDrafts(old=>old.map(d=>d.id===activeDraftId?{...d,cart:typeof fn==='function'?fn(d.cart):fn}:d))
 const setCustomer=fn=>setDrafts(old=>old.map(d=>d.id===activeDraftId?{...d,customer:typeof fn==='function'?fn(d.customer):fn}:d))
 const openDraft=id=>{setActiveDraftId(id);navigate('/catalog')}
 const deleteDraft=id=>{setDrafts(old=>old.filter(d=>d.id!==id));if(activeDraftId===id){setActiveDraftId(null);navigate('/')}}
 const createOrder=()=>{if(!activeDraft)return;const {customer,cart}=activeDraft;const total=cart.reduce((a,i)=>a+i.price*i.qty,0);const order={id:`ORD-${Date.now().toString().slice(-9)}`,customer:customer.name,phone:customer.phone,date:new Date().toLocaleString('id-ID',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}),total,status:'Menunggu Pembayaran',items:cart.map(i=>({productId:i.id,qty:i.qty}))};setOrders(old=>[order,...old]);setDrafts(old=>old.filter(d=>d.id!==activeDraftId));setActiveDraftId(null);setSuccess(order);navigate('/orders')}
 const changePage=(id,filter)=>{navigate(id==='dashboard'?'/':`/${id}`,{state:filter?{filter}:{}})}
 if(!loggedIn)return <div className="app-shell" data-theme={theme}><Login onLogin={()=>setLoggedIn(true)} theme={theme} setTheme={setTheme}/></div>
 const current=location.pathname==='/'?'dashboard':location.pathname.slice(1);const pageTitle=current==='catalog'?(activeDraft?.customer.name||'Pesanan Baru'):current==='orders'?'Pesanan Saya':'Beranda';const pageSub=current==='catalog'?'Workspace pesanan customer':current==='orders'?'Riwayat pesanan yang kamu buat':'Ringkasan aktivitas sales'
 return <div className="app-shell" data-theme={theme}><Sidebar onLogout={()=>{setLoggedIn(false);navigate('/')}} page={current} setPage={changePage} drafts={drafts} activeDraftId={activeDraftId} openDraft={openDraft} onDeleteDraft={deleteDraft} theme={theme} setTheme={setTheme} open={sidebarOpen} setOpen={setSidebarOpen}/><main className="main-area"><Topbar title={pageTitle} subtitle={pageSub} onMenu={()=>setSidebarOpen(true)} onNotifications={()=>changePage('orders', 'pending')}/><Routes><Route path="/" element={<Dashboard orders={orders} drafts={drafts} setPage={changePage} createDraft={createDraft} openDraft={openDraft}/>}/><Route path="/catalog" element={activeDraft?<Catalog key={activeDraft.id} cart={activeDraft.cart} setCart={setCart} customer={activeDraft.customer} setCustomer={setCustomer} onCreateOrder={createOrder}/>:<Dashboard orders={orders} drafts={drafts} setPage={changePage} createDraft={createDraft} openDraft={openDraft}/>}/><Route path="/orders" element={<Orders orders={orders} initialFilter={location.state?.filter}/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes></main>{success&&<div className="modal-overlay"><section className="modal success-modal"><div className="success-check">✓</div><span className="eyebrow">ORDER CREATED</span><h2>Pesanan berhasil dibuat!</h2><p>Pesanan sudah dikonfirmasi. Silakan arahkan customer ke kasir untuk pembayaran.</p><div className="success-order-code">{success.id}</div><div className="success-meta"><span>Nama pelanggan</span><b>{success.customer}</b><span>Total pesanan</span><b>{new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(success.total)}</b><span>Status</span><b className="text-pending">Menunggu Pembayaran</b></div><button className="btn-primary full-btn" onClick={()=>setSuccess(null)}>Lihat Pesanan <span>→</span></button></section></div>}</div>
}
