import React, { useMemo, useState } from 'react'
import { Search, Boxes, AlertTriangle, CheckCircle, PackageX, Plus, Minus, ArrowUpDown, Filter } from 'lucide-react'
import { rupiah, products as initialProductList } from '../data/mockData'
import ProductArt from '../components/ProductArt'

/* ========================================================
   PARAMETER PENGATURAN STOK (Bisa disesuaikan sendiri)
   ======================================================== */
export const STOCK_CONFIG = {
  allowStockAdjustment: false, // Parameter: false = sales hanya lihat sisa stok (read-only), true = tampilkan tombol +/-
  lowStockThreshold: 5,        // Batas stok tipis: <= 5 dianggap 'Menipis'
  categories: ['Semua', 'Meja', 'Kursi', 'Sofa', 'Lemari', 'Rak'], // Daftar kategori produk
  sortByOptions: ['Nama (A-Z)', 'Stok Terendah', 'Stok Tertinggi', 'Harga Tertinggi']
}

export default function Stock() {
  const [productList, setProductList] = useState(initialProductList)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Semua')
  const [statusFilter, setStatusFilter] = useState('Semua') // 'Semua' | 'Tersedia' | 'Menipis' | 'Habis'
  const [sortBy, setSortBy] = useState('Nama (A-Z)')

  // Ringkasan metrik inventaris (Memoized agar performa render ringan)
  const stats = useMemo(() => {
    let totalItems = 0
    let totalUnits = 0
    let totalValue = 0
    let lowStockCount = 0
    let outOfStockCount = 0

    productList.forEach(p => {
      totalItems += 1
      totalUnits += p.stock
      totalValue += p.price * p.stock
      if (p.stock === 0) outOfStockCount += 1
      else if (p.stock <= STOCK_CONFIG.lowStockThreshold) lowStockCount += 1
    })

    return { totalItems, totalUnits, totalValue, lowStockCount, outOfStockCount }
  }, [productList])

  // Filter & sorting produk secara efisien
  const filteredProducts = useMemo(() => {
    return productList.filter(p => {
      const matchQuery = `${p.name} ${p.sku} ${p.id}`.toLowerCase().includes(query.toLowerCase())
      const matchCat = category === 'Semua' || p.category === category
      const matchStatus =
        statusFilter === 'Semua' ||
        (statusFilter === 'Habis' && p.stock === 0) ||
        (statusFilter === 'Menipis' && p.stock > 0 && p.stock <= STOCK_CONFIG.lowStockThreshold) ||
        (statusFilter === 'Tersedia' && p.stock > STOCK_CONFIG.lowStockThreshold)
      return matchQuery && matchCat && matchStatus
    }).sort((a, b) => {
      if (sortBy === 'Nama (A-Z)') return a.name.localeCompare(b.name)
      if (sortBy === 'Stok Terendah') return a.stock - b.stock
      if (sortBy === 'Stok Tertinggi') return b.stock - a.stock
      if (sortBy === 'Harga Tertinggi') return b.price - a.price
      return 0
    })
  }, [productList, query, category, statusFilter, sortBy])

  // Pengubah jumlah stok cepat (+ / -)
  const adjustStock = (id, delta) => {
    setProductList(prev =>
      prev.map(item =>
        item.id === id ? { ...item, stock: Math.max(0, item.stock + delta) } : item
      )
    )
  }

  return (
    <div className="page-content stock-page">
      <div className="catalog-heading">
        <div>
          <span className="eyebrow">INVENTORY & WAREHOUSE</span>
          <h2>Stok Barang</h2>
          <p>Pantau persediaan furnitur toko, barang menipis, dan valuasi aset gudang secara real-time.</p>
        </div>
      </div>

      {/* METRIK KARTU INVENTARIS */}
      <div className="stats-grid">
        <article className="stat-card">
          <div className="stat-icon red"><Boxes size={19}/></div>
          <span>Total Produk</span>
          <div className="stat-value">{stats.totalItems}<small> SKU</small></div>
          <div className="stat-foot">{stats.totalUnits} unit total fisik</div>
        </article>

        <article className="stat-card">
          <div className="stat-icon green"><CheckCircle size={19}/></div>
          <span>Stok Tersedia</span>
          <div className="stat-value">{stats.totalItems - stats.lowStockCount - stats.outOfStockCount}<small> SKU</small></div>
          <div className="stat-foot">Persediaan aman & siap jual</div>
        </article>

        <article className="stat-card">
          <div className="stat-icon amber"><AlertTriangle size={19}/></div>
          <span>Stok Menipis</span>
          <div className="stat-value">{stats.lowStockCount}<small> SKU</small></div>
          <div className="stat-foot">Perlu re-stock (≤ {STOCK_CONFIG.lowStockThreshold} unit)</div>
        </article>

        <article className="stat-card">
          <div className="stat-icon violet"><PackageX size={19}/></div>
          <span>Stok Habis</span>
          <div className="stat-value">{stats.outOfStockCount}<small> SKU</small></div>
          <div className="stat-foot">Segera hubungi supplier</div>
        </article>
      </div>

      {/* TABEL DAFTAR STOK */}
      <section className="panel orders-panel stock-panel">
        <div className="orders-toolbar stock-toolbar">
          <div className="search-box">
            <Search size={17}/>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Cari nama barang, SKU, atau ID..."
            />
          </div>

          <div className="stock-filter-row">
            <div className="order-filters">
              {['Semua', 'Tersedia', 'Menipis', 'Habis'].map(status => (
                <button
                  key={status}
                  className={statusFilter === status ? 'selected' : ''}
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="stock-sort-wrap">
              <ArrowUpDown size={14} className="text-muted"/>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="stock-sort-select"
              >
                {STOCK_CONFIG.sortByOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Kategori chips */}
        <div className="category-row stock-category-row">
          {STOCK_CONFIG.categories.map(cat => (
            <button
              key={cat}
              className={category === cat ? 'selected' : ''}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Produk</th>
                <th>Kategori & SKU</th>
                <th>Dimensi Ukuran</th>
                <th>Harga Satuan</th>
                <th>Jumlah Stok</th>
                <th>Status</th>
                {STOCK_CONFIG.allowStockAdjustment && <th style={{ textAlign: 'right' }}>Sesuaikan Stok</th>}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => {
                const isOutOfStock = p.stock === 0
                const isLowStock = !isOutOfStock && p.stock <= STOCK_CONFIG.lowStockThreshold
                return (
                  <tr key={p.id}>
                    <td>
                      <div className="stock-product-cell">
                        <div className="stock-product-thumb">
                          <ProductArt tone={p.color} />
                        </div>
                        <div>
                          <b>{p.name}</b>
                          <small className="sub-table">{p.id}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>{p.category}</div>
                      <small className="sub-table">{p.sku}</small>
                    </td>
                    <td className="muted-cell">{p.size}</td>
                    <td className="amount-cell">{rupiah(p.price)}</td>
                    <td>
                      <b style={{ fontSize: '13px' }}>{p.stock}</b> <span className="muted-cell">unit</span>
                    </td>
                    <td>
                      {isOutOfStock ? (
                        <span className="status-pill cancelled"><i></i> Habis</span>
                      ) : isLowStock ? (
                        <span className="status-pill pending"><i></i> Menipis</span>
                      ) : (
                        <span className="status-pill paid"><i></i> Aman</span>
                      )}
                    </td>
                    {STOCK_CONFIG.allowStockAdjustment && (
                      <td>
                        <div className="stock-qty-actions">
                          <button
                            type="button"
                            className="stock-qty-btn"
                            disabled={p.stock <= 0}
                            onClick={() => adjustStock(p.id, -1)}
                            title="Kurangi 1 unit"
                            aria-label="Kurangi 1 unit"
                          >
                            <Minus size={13}/>
                          </button>
                          <button
                            type="button"
                            className="stock-qty-btn add"
                            onClick={() => adjustStock(p.id, 1)}
                            title="Tambah 1 unit"
                            aria-label="Tambah 1 unit"
                          >
                            <Plus size={13}/>
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>

          {!filteredProducts.length && (
            <div className="empty-state">
              <Boxes size={32}/>
              <b>Produk tidak ditemukan</b>
              <span>Coba ubah kata kunci pencarian atau reset filter kategori.</span>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

