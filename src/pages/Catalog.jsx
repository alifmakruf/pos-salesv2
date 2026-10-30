import React, { useMemo, useState } from 'react'
import { Search, ScanLine, Plus, Minus, ShoppingBag, Trash2, ArrowRight, UserRound, X, Check, Hash, UserCheck, ClipboardList, ChevronRight, RotateCcw } from 'lucide-react'
import ProductArt from '../components/ProductArt'
import ScannerModal from '../components/ScannerModal'
import { products, rupiah } from '../data/mockData'

const methods = [
  { id: 'name', title: 'Name Search', description: 'Cari barang berdasarkan nama produk.', icon: Search },
  { id: 'id', title: 'ID Search', description: 'Masukkan ID atau SKU barang secara langsung.', icon: Hash },
  { id: 'scan', title: 'Scan Search', description: 'Pindai barcode barang menggunakan kamera.', icon: ScanLine },
]

export default function Catalog({ cart, setCart, customer, setCustomer, onCreateOrder }) {
  const [step, setStep] = useState('products')
  const [method, setMethod] = useState('name')
  const [query, setQuery] = useState('')
  const [idQuery, setIdQuery] = useState('')
  const [category, setCategory] = useState('Semua')
  const [scanner, setScanner] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [customerModal, setCustomerModal] = useState(false)
  const [pendingConfirm, setPendingConfirm] = useState(false)
  const [notice, setNotice] = useState('')
  const [idResult, setIdResult] = useState(null)

  const categories = ['Semua', 'Meja', 'Kursi', 'Sofa', 'Lemari', 'Rak']
  const filtered = useMemo(() => products.filter(p =>
    (category === 'Semua' || p.category === category) &&
    `${p.name} ${p.sku} ${p.id}`.toLowerCase().includes(query.toLowerCase())
  ), [category, query])
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const count = cart.reduce((sum, item) => sum + item.qty, 0)

  const toast = message => {
    setNotice(message)
    window.clearTimeout(toast.timer)
    toast.timer = window.setTimeout(() => setNotice(''), 2800)
  }
  const add = p => {
    if (!p || !p.stock) return
    setCart(old => {
      const found = old.find(i => i.id === p.id)
      return found ? old.map(i => i.id === p.id ? { ...i, qty: Math.min(i.qty + 1, p.stock) } : i) : [...old, { ...p, qty: 1 }]
    })
    setMethod('name')
    setQuery('')
    setIdQuery('')
    setIdResult(null)
    toast(`${p.name} ditambahkan ke pesanan`)
  }
  const change = (id, delta) => setCart(old => old.map(i => i.id === id ? { ...i, qty: Math.max(0, Math.min(i.qty + delta, products.find(p => p.id === id)?.stock || 99)) } : i).filter(i => i.qty > 0))
  const findById = value => products.find(p => p.id.toLowerCase() === value.trim().toLowerCase() || p.sku.toLowerCase() === value.trim().toLowerCase())
  const submitIdSearch = e => {
    e.preventDefault()
    const found = findById(idQuery)
    setIdResult(found || false)
    if (!found) toast(`Barang dengan ID/SKU "${idQuery}" tidak ditemukan`)
  }
  const scan = value => {
    const found = findById(value)
    setScanner(false)
    if (found) add(found)
    else toast(`Barang dengan barcode "${value}" tidak ditemukan`)
  }
  const saveCustomer = e => {
    e.preventDefault()
    if (!customer.name.trim()) return
    setCustomerModal(false)
    if (pendingConfirm) { setPendingConfirm(false); setConfirm(true) }
  }
  const requestConfirmation = () => {
    if (!customer.name.trim()) { setPendingConfirm(true); setCustomerModal(true); return }
    setConfirm(true)
  }
  const confirmOrder = () => {
    if (!cart.length || !customer.name.trim()) return
    onCreateOrder()
    setConfirm(false)
    setMethod('name')
    setStep('products')
  }

  return <div className="page-content catalog-page flow-catalog">
    <div className="catalog-heading">
      <div><span className="eyebrow">SALES ORDER</span><h2>{step === 'summary' ? 'Ringkasan Pesanan' : 'Pesanan Baru'}</h2><p>{step === 'summary' ? 'Periksa kembali barang dan total sebelum mengonfirmasi pesanan.' : 'Pilih barang melalui nama, ID, atau scan barcode. Data customer bisa diisi kapan saja.'}</p></div>
      <button className={`flow-customer-action ${customer.name ? 'has-customer' : ''}`} onClick={() => setCustomerModal(true)}><UserRound size={16}/><span>{customer.name || 'Tambah Data Customer'}</span><small>{customer.name ? 'Ubah' : 'Opsional dulu'}</small></button>
    </div>

    {step === 'products' && <div className="catalog-layout flow-product-layout">
      <section className="catalog-main">
        <div className="flow-search-panel flow-unified-search">
          <div className="flow-search-head">
            <div><span className="eyebrow">PENCARIAN BARANG</span><h3>{method === 'name' ? 'Cari berdasarkan nama barang' : method === 'id' ? 'Cari berdasarkan ID barang' : 'Scan barcode barang'}</h3></div>
            <div className="flow-search-options" aria-label="Metode pencarian barang">
              <button type="button" className={method === 'name' ? 'active' : ''} title="Cari berdasarkan nama" aria-label="Cari berdasarkan nama" onClick={() => { setMethod('name'); setIdResult(null) }}><Search size={18}/></button>
              <button type="button" className={method === 'id' ? 'active' : ''} title="Cari dengan ID" aria-label="Cari dengan ID" onClick={() => { setMethod('id'); setIdResult(null) }}><Hash size={18}/></button>
              <button type="button" className={method === 'scan' ? 'active' : ''} title="Scan barcode" aria-label="Scan barcode" onClick={() => { setMethod('scan'); setScanner(true) }}><ScanLine size={18}/></button>
            </div>
          </div>
          {method === 'name' && <>
            <div className="catalog-toolbar"><div className="search-box"><Search size={17}/><input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Cari nama barang..."/><button className="search-clear" onClick={() => setQuery('')} aria-label="Hapus pencarian"><X size={15}/></button></div></div>
            <div className="category-row">{categories.map(c => <button key={c} onClick={() => setCategory(c)} className={category === c ? 'selected' : ''}>{c}</button>)}</div>
          </>}
          {method === 'id' && <form className="flow-id-form" onSubmit={submitIdSearch}><div className="field-icon"><Hash size={17}/><input autoFocus value={idQuery} onChange={e => { setIdQuery(e.target.value); setIdResult(null) }} placeholder="Masukkan ID atau SKU barang"/><button className="btn-primary" type="submit" disabled={!idQuery.trim()}>Cari</button></div></form>}
          {method === 'scan' && <div className="flow-scan-inline"><ScanLine size={19}/><span>Arahkan kamera ke barcode produk untuk menambahkan barang.</span><button className="btn-outline" onClick={() => setScanner(true)}>Buka Scanner</button></div>}
          {idResult === false && method === 'id' && <div className="flow-not-found">Barang tidak ditemukan. Periksa kembali ID atau SKU yang dimasukkan.</div>}
        </div>
        <div className="flow-product-list">
          <div className="results-caption"><span>{method === 'name' ? 'Daftar barang' : method === 'id' ? 'Barang ditemukan' : 'Daftar barang'}</span><b>{method === 'name' ? `${filtered.length} barang` : method === 'id' ? (idResult && idResult !== false ? '1 barang' : 'Cari menggunakan ID') : `${products.length} barang`}</b></div>
          {method === 'name' && <div className="product-grid">{filtered.map(p => <ProductCard key={p.id} p={p} cart={cart} onAdd={add} onChange={change}/>)}</div>}
          {method === 'name' && !filtered.length && <EmptyProducts/>}
          {method === 'id' && idResult && idResult !== false && <div className="product-grid"><ProductCard p={idResult} cart={cart} onAdd={add} onChange={change}/></div>}
          {method === 'scan' && <div className="product-grid">{products.map(p => <ProductCard key={p.id} p={p} cart={cart} onAdd={add} onChange={change}/>)}</div>}
        </div>
      </section>
      <aside className="cart-panel"><div className="cart-head"><div><h3>Pesanan Customer</h3><p>Barang yang sudah dipilih</p></div><span className="cart-count">{count} item</span></div><div className="cart-items">{cart.length ? cart.map(i => <div className="cart-item" key={i.id}><div className="cart-thumb"><ProductArt tone={i.color}/></div><div className="cart-item-main"><b>{i.name}</b><span>{rupiah(i.price)}</span><div className="qty-control"><button onClick={() => change(i.id, -1)}><Minus size={12}/></button><b>{i.qty}</b><button onClick={() => change(i.id, 1)}><Plus size={12}/></button></div></div><div className="cart-item-end"><b>{rupiah(i.price * i.qty)}</b><button onClick={() => change(i.id, -i.qty)} aria-label="Hapus"><Trash2 size={14}/></button></div></div>) : <div className="cart-empty"><div><ShoppingBag size={23}/></div><b>Belum ada barang</b><span>Cari barang pada daftar produk untuk menambahkannya ke pesanan.</span></div>}</div><div className="cart-summary"><div><span>Jumlah barang</span><b>{count} item</b></div><div className="cart-total"><span>Total harga</span><b>{rupiah(total)}</b></div><p className="cart-hint">Total akan diperiksa kembali sebelum pesanan dikonfirmasi.</p></div><div className="cart-finish"><button className="btn-primary" disabled={!cart.length} onClick={() => setStep('summary')}>Selesai Memilih <ArrowRight size={16}/></button></div></aside>
    </div>}

    {step === 'summary' && <section className="flow-summary-card"><div className="flow-summary-top"><div><span className="eyebrow">RINGKASAN PESANAN</span><h3>Periksa ringkasan pesanan</h3><p>Pastikan barang dan jumlahnya sudah sesuai dengan pilihan customer.</p></div><button className="btn-outline" onClick={() => setStep('products')}><Plus size={15}/> Tambah Barang</button></div><div className="flow-summary-customer"><div className="flow-summary-avatar"><UserRound size={20}/></div><div><small>Customer</small><b>{customer.name || 'Belum diisi'}</b>{customer.phone && <span>+62 {customer.phone}</span>}</div><button className="btn-outline" onClick={() => setCustomerModal(true)}> {customer.name ? 'Ubah' : 'Isi Data'} </button></div><div className="flow-summary-items">{cart.map(i => <div className="flow-summary-item" key={i.id}><div className="flow-summary-thumb"><ProductArt tone={i.color}/></div><div className="flow-summary-item-name"><b>{i.name}</b><span>{i.id} · {rupiah(i.price)} × {i.qty}</span></div><strong>{rupiah(i.price * i.qty)}</strong><div className="qty-control"><button onClick={() => change(i.id, -1)}><Minus size={12}/></button><b>{i.qty}</b><button onClick={() => change(i.id, 1)}><Plus size={12}/></button></div></div>)}</div><div className="flow-summary-total"><div><span>Jumlah barang</span><b>{count} barang</b></div><div className="flow-grand-total"><span>Total harga</span><b>{rupiah(total)}</b></div></div><div className="flow-summary-actions"><button className="btn-outline" onClick={() => setStep('products')}><RotateCcw size={15}/> Kembali Pilih Barang</button><button className="btn-primary" disabled={!cart.length} onClick={requestConfirmation}>Konfirmasi Pesanan <ArrowRight size={17}/></button></div></section>}

    {notice && <div className="toast"><span>✓</span>{notice}</div>}
    {scanner && <ScannerModal onClose={() => setScanner(false)} onScan={scan}/>}
    {customerModal && <div className="modal-overlay" onMouseDown={e => e.target === e.currentTarget && (setCustomerModal(false), setPendingConfirm(false))}><section className="modal flow-customer-modal"><button className="modal-close" onClick={() => { setCustomerModal(false); setPendingConfirm(false) }} aria-label="Tutup"><X size={17}/></button><div className="flow-confirm-icon"><UserRound size={23}/></div><span className="eyebrow">DATA CUSTOMER</span><h2>Informasi customer</h2><p>Data bisa diisi sebelum atau sesudah memilih barang. Nama diperlukan saat konfirmasi pesanan.</p><form className="flow-customer-form" onSubmit={saveCustomer}><label>Nama customer <em>*</em></label><div className="field-icon"><UserRound size={17}/><input autoFocus required value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} placeholder="Masukkan nama customer"/></div><label>Nomor telepon <span className="optional-label">Opsional</span></label><div className="field-icon"><span className="phone-prefix">+62</span><input inputMode="tel" value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })} placeholder="81234567890"/></div><div className="flow-customer-modal-actions"><button type="button" className="btn-outline" onClick={() => { setCustomerModal(false); setPendingConfirm(false) }}>Nanti saja</button><button className="btn-primary" type="submit">Simpan Data <Check size={16}/></button></div></form></section></div>}
    {confirm && <div className="modal-overlay" onMouseDown={e => e.target === e.currentTarget && setConfirm(false)}><section className="modal flow-confirm-modal"><div className="flow-confirm-icon"><ClipboardList size={24}/></div><span className="eyebrow">KONFIRMASI PESANAN</span><h2>Konfirmasi pesanan customer?</h2><p>Pesanan atas nama <b>{customer.name}</b> akan disimpan dan diteruskan ke proses kasir.</p><div className="flow-confirm-recap"><span>{count} barang</span><b>{rupiah(total)}</b></div><div className="flow-confirm-actions"><button className="btn-outline" onClick={() => setConfirm(false)}>Periksa Lagi</button><button className="btn-primary" onClick={confirmOrder}><Check size={16}/> Ya, Konfirmasi</button></div></section></div>}
  </div>
}

function ProductCard({ p, cart, onAdd, onChange }) {
  const inCart = cart.find(i => i.id === p.id)
  const [showPicked, setShowPicked] = useState(false)
  const [pickedQty, setPickedQty] = useState(0)
  const handleAdd = () => {
    onAdd(p)
    setPickedQty(current => Math.min((inCart?.qty || 0) + 1, p.stock))
    setShowPicked(true)
    window.clearTimeout(handleAdd.timer)
    handleAdd.timer = window.setTimeout(() => setShowPicked(false), 3000)
  }
  return <article className={`product-card ${!p.stock ? 'out-stock' : ''}`}>
    <div className="product-image"><ProductArt tone={p.color}/>{p.tag && <span className="product-tag">{p.tag}</span>}{!p.stock && <span className="stock-overlay">Stok habis</span>}</div>
    <div className="product-info"><div className="product-category">{p.category} <span>·</span> {p.id}</div><h3>{p.name}</h3><div className="product-size">{p.size}</div>
      <div className="product-bottom"><div><b>{rupiah(p.price)}</b><span className={p.stock <= 3 ? 'low-stock' : ''}>{p.stock > 0 ? `Stok ${p.stock}` : 'Habis'}</span></div>
        <div className="product-action-wrap">
          {showPicked && <span className="picked-count-pop">{pickedQty} dipilih</span>}
          {inCart ? <div className="product-qty-control"><button type="button" aria-label={`Kurangi ${p.name}`} onClick={() => onChange(p.id, -1)}><Minus size={14}/></button><b>{inCart.qty}</b><button type="button" aria-label={`Tambah ${p.name}`} disabled={inCart.qty >= p.stock} onClick={handleAdd}><Plus size={14}/></button></div> : <button disabled={!p.stock} className="add-product" aria-label={`Tambah ${p.name}`} onClick={handleAdd}><Plus size={17}/></button>}
        </div>
      </div>
    </div>
  </article>
}
function EmptyProducts() { return <div className="empty-state"><ShoppingBag size={30}/><b>Barang tidak ditemukan</b><span>Coba kata kunci atau kategori lainnya.</span></div> }
