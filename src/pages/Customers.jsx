import React, { useMemo, useState } from 'react'
import { Search, Users, UserCheck, Wallet, ShoppingBag, Phone, Calendar, ArrowUpRight, X, Clock, Award } from 'lucide-react'
import { rupiah, products } from '../data/mockData'

/* ========================================================
   PARAMETER PENGATURAN PELANGGAN (Bisa disesuaikan sendiri)
   ======================================================== */
export const CUSTOMER_CONFIG = {
  vipThreshold: 3000000, // Minimal akumulasi belanja Rp 3.000.000 untuk kategori 'VIP Member'
  filterOptions: ['Semua', 'VIP Member', 'Regular']
}

export default function Customers({ orders }) {
  const [query, setQuery] = useState('')
  const [filterType, setFilterType] = useState('Semua')
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  // Agregasi data pelanggan unik dari seluruh transaksi yang tercatat
  const customerList = useMemo(() => {
    const map = new Map()

    orders.forEach(order => {
      const name = (order.customer || '').trim()
      if (!name) return

      // Gunakan nama + phone sebagai key unik
      const key = `${name.toLowerCase()}_${order.phone || ''}`
      if (!map.has(key)) {
        map.set(key, {
          name,
          phone: order.phone || '—',
          ordersCount: 0,
          totalSpent: 0,
          paidSpent: 0,
          lastOrderDate: order.date,
          orderHistory: []
        })
      }

      const c = map.get(key)
      c.ordersCount += 1
      c.totalSpent += order.total
      if (order.status === 'Lunas') c.paidSpent += order.total
      c.orderHistory.push(order)
    })

    return Array.from(map.values())
  }, [orders])

  // Metrik ringkasan pelanggan
  const stats = useMemo(() => {
    const totalCustomers = customerList.length
    const totalRevenue = customerList.reduce((acc, c) => acc + c.totalSpent, 0)
    const vipCount = customerList.filter(c => c.totalSpent >= CUSTOMER_CONFIG.vipThreshold).length
    const avgSpent = totalCustomers ? Math.round(totalRevenue / totalCustomers) : 0

    return { totalCustomers, totalRevenue, vipCount, avgSpent }
  }, [customerList])

  // Filter pencarian
  const filteredCustomers = useMemo(() => {
    return customerList.filter(c => {
      const matchesSearch = `${c.name} ${c.phone}`.toLowerCase().includes(query.toLowerCase())
      const isVip = c.totalSpent >= CUSTOMER_CONFIG.vipThreshold
      const matchesType =
        filterType === 'Semua' ||
        (filterType === 'VIP Member' && isVip) ||
        (filterType === 'Regular' && !isVip)
      return matchesSearch && matchesType
    })
  }, [customerList, query, filterType])

  return (
    <div className="page-content customers-page">
      <div className="catalog-heading">
        <div>
          <span className="eyebrow">CUSTOMER RELATIONSHIP</span>
          <h2>Daftar Pelanggan</h2>
          <p>Daftar pelanggan yang telah melakukan pemesanan dan riwayat akumulasi transaksi.</p>
        </div>
      </div>

      {/* METRIK KARTU PELANGGAN */}
      <div className="stats-grid">
        <article className="stat-card">
          <div className="stat-icon red"><Users size={19}/></div>
          <span>Total Pelanggan</span>
          <div className="stat-value">{stats.totalCustomers}<small> orang</small></div>
          <div className="stat-foot">Terdaftar dari transaksi sales</div>
        </article>

        <article className="stat-card">
          <div className="stat-icon green"><Award size={19}/></div>
          <span>Pelanggan VIP</span>
          <div className="stat-value">{stats.vipCount}<small> member</small></div>
          <div className="stat-foot">Belanja ≥ {rupiah(CUSTOMER_CONFIG.vipThreshold)}</div>
        </article>

        <article className="stat-card">
          <div className="stat-icon amber"><Wallet size={19}/></div>
          <span>Total Akumulasi Nilai</span>
          <div className="stat-value stat-money">{rupiah(stats.totalRevenue)}</div>
          <div className="stat-foot">Omzet dari seluruh pelanggan</div>
        </article>

        <article className="stat-card">
          <div className="stat-icon violet"><ShoppingBag size={19}/></div>
          <span>Rata-rata Transaksi</span>
          <div className="stat-value stat-money">{rupiah(stats.avgSpent)}</div>
          <div className="stat-foot">Rata-rata nilai per pelanggan</div>
        </article>
      </div>

      {/* TABEL PELANGGAN */}
      <section className="panel orders-panel">
        <div className="orders-toolbar">
          <div className="search-box">
            <Search size={17}/>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Cari nama pelanggan atau nomor telepon..."
            />
          </div>

          <div className="order-filters">
            {CUSTOMER_CONFIG.filterOptions.map(f => (
              <button
                key={f}
                className={filterType === f ? 'selected' : ''}
                onClick={() => setFilterType(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Pelanggan</th>
                <th>Nomor Kontak</th>
                <th>Total Transaksi</th>
                <th>Akumulasi Belanja</th>
                <th>Transaksi Terakhir</th>
                <th>Kategori Member</th>
                <th style={{ textAlign: 'right' }}>Riwayat</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((c, i) => {
                const isVip = c.totalSpent >= CUSTOMER_CONFIG.vipThreshold
                return (
                  <tr key={`${c.name}-${i}`}>
                    <td>
                      <div className="customer-info-cell">
                        <div className="avatar customer-avatar">
                          {c.name.slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <b>{c.name}</b>
                          <small className="sub-table">Customer #{String(i + 1).padStart(3, '0')}</small>
                        </div>
                      </div>
                    </td>
                    <td className="muted-cell">{c.phone}</td>
                    <td>
                      <b style={{ fontSize: '13px' }}>{c.ordersCount}</b> <span className="muted-cell">pesanan</span>
                    </td>
                    <td className="amount-cell">{rupiah(c.totalSpent)}</td>
                    <td className="muted-cell">{c.lastOrderDate}</td>
                    <td>
                      {isVip ? (
                        <span className="status-pill vip-pill">
                          <Award size={12}/> VIP Member
                        </span>
                      ) : (
                        <span className="status-pill regular-pill">
                          Regular
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        className="row-arrow"
                        onClick={() => setSelectedCustomer(c)}
                        title="Lihat riwayat transaksi pelanggan"
                        aria-label="Lihat riwayat transaksi"
                      >
                        <ArrowUpRight size={16}/>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {!filteredCustomers.length && (
            <div className="empty-state">
              <Users size={32}/>
              <b>Pelanggan tidak ditemukan</b>
              <span>Belum ada data pelanggan yang cocok dengan pencarian Anda.</span>
            </div>
          )}
        </div>
      </section>

      {/* MODAL RIWAYAT TRANSAKSI CUSTOMER */}
      {selectedCustomer && (
        <div className="modal-overlay" onMouseDown={e => e.target === e.currentTarget && setSelectedCustomer(null)}>
          <section className="modal customer-detail-modal">
            <div className="modal-head">
              <div>
                <span className="eyebrow">CUSTOMER PROFILE</span>
                <h2>{selectedCustomer.name}</h2>
                <p>Riwayat seluruh transaksi yang dilakukan oleh pelanggan ini.</p>
              </div>
              <button className="icon-btn" onClick={() => setSelectedCustomer(null)} aria-label="Tutup">
                <X size={19}/>
              </button>
            </div>

            <div className="customer-detail-summary">
              <div className="detail-stat">
                <span>Total Belanja</span>
                <b>{rupiah(selectedCustomer.totalSpent)}</b>
              </div>
              <div className="detail-stat">
                <span>Jumlah Pesanan</span>
                <b>{selectedCustomer.ordersCount} kali</b>
              </div>
              <div className="detail-stat">
                <span>Telepon</span>
                <b>{selectedCustomer.phone}</b>
              </div>
            </div>

            <h3 className="detail-section-title">Riwayat Pesanan ({selectedCustomer.orderHistory.length})</h3>
            <div className="customer-orders-list">
              {selectedCustomer.orderHistory.map(ord => (
                <div key={ord.id} className="customer-order-item">
                  <div className="customer-order-head">
                    <span className="order-code">{ord.id}</span>
                    <span className="muted-cell">{ord.date}</span>
                    <span className={`status-pill ${ord.status === 'Lunas' ? 'paid' : ord.status === 'Dibatalkan' ? 'cancelled' : 'pending'}`}>
                      <i></i>{ord.status}
                    </span>
                  </div>
                  <div className="customer-order-items">
                    {ord.items.map((it, idx) => {
                      const p = products.find(prod => prod.id === it.productId)
                      return (
                        <div key={idx} className="customer-item-row">
                          <span>{p?.name || it.productId} × {it.qty}</span>
                          <strong>{rupiah((p?.price || 0) * it.qty)}</strong>
                        </div>
                      )
                    })}
                  </div>
                  <div className="customer-order-total">
                    <span>Total Pembayaran:</span>
                    <b>{rupiah(ord.total)}</b>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

