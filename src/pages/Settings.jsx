import React, { useState } from 'react'
import { Sun, Moon, Volume2, VolumeX, Store, User, Trash2, Check, RefreshCw, Smartphone, Zap } from 'lucide-react'

/* ========================================================
   PARAMETER PENGATURAN SISTEM (Dapat Anda sesuaikan sendiri)
   ======================================================== */
export const DEFAULT_CONFIG = {
  theme: 'dark',               // Pilihan: 'dark' | 'light'
  salesName: 'Firman Alif',    // Nama sales kasir
  outletName: 'QUARZA Jakarta Central', // Nama cabang toko
  outletCode: 'QZ-JKT-01',     // Kode outlet POS
  scanSound: true,             // Suara beep konfirmasi scan barcode (true: aktif, false: senyap)
  quickOrderConfirm: false,    // Lewati modal konfirmasi ganda saat checkout
  compactMode: false           // Mode tampilan padat untuk layar tablet/POS
}

export default function Settings({ theme, setTheme, drafts = [], setDrafts }) {
  // Load preferensi dari localStorage atau gunakan DEFAULT_CONFIG
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('quarza_pos_settings')
      return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : DEFAULT_CONFIG
    } catch {
      return DEFAULT_CONFIG
    }
  })

  const [savedNotice, setSavedNotice] = useState(false)

  const updateSetting = (key, value) => {
    const updated = { ...config, [key]: value }
    setConfig(updated)
    try {
      localStorage.setItem('quarza_pos_settings', JSON.stringify(updated))
    } catch {}

    // Feedback notifikasi ringan
    setSavedNotice(true)
    clearTimeout(updateSetting.timer)
    updateSetting.timer = setTimeout(() => setSavedNotice(false), 2000)
  }

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    updateSetting('theme', newTheme)
  }

  const clearAllDrafts = () => {
    if (window.confirm(`Hapus semua ${drafts.length} pesanan aktif yang sedang dikerjakan?`)) {
      setDrafts([])
      setSavedNotice(true)
      setTimeout(() => setSavedNotice(false), 2000)
    }
  }

  const resetSettings = () => {
    if (window.confirm('Kembalikan semua pengaturan ke setelan default pabrik?')) {
      setConfig(DEFAULT_CONFIG)
      setTheme(DEFAULT_CONFIG.theme)
      localStorage.removeItem('quarza_pos_settings')
      setSavedNotice(true)
      setTimeout(() => setSavedNotice(false), 2000)
    }
  }

  return (
    <div className="page-content settings-page">
      <div className="welcome-row">
        <div>
          <span className="eyebrow">PREFERENCES</span>
          <h2>Pengaturan Sistem <span>✦</span></h2>
          <p>Konfigurasi preferensi tampilan, operasional sales, dan perangkat POS.</p>
        </div>
        <button className="btn-outline" onClick={resetSettings} title="Reset ke default">
          <RefreshCw size={15}/> Reset Default
        </button>
      </div>

      <div className="settings-grid">
        {/* SEKSI 1: Tema & Tampilan Antarmuka */}
        <section className="panel settings-panel">
          <div className="settings-panel-head">
            <Sun size={20} className="panel-head-icon" />
            <div>
              <h3>Tampilan & Tema Warna</h3>
              <p>Pilih tema visual yang paling nyaman untuk mata saat bertugas.</p>
            </div>
          </div>

          <div className="theme-selector-grid">
            <button
              type="button"
              className={`theme-option-card ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => handleThemeChange('dark')}
            >
              <div className="theme-preview dark-preview">
                <div className="preview-nav"/>
                <div className="preview-card"/>
              </div>
              <div className="theme-option-info">
                <div className="theme-title-row">
                  <Moon size={16} />
                  <b>Dark Espresso</b>
                  {theme === 'dark' && <span className="active-badge"><Check size={12}/> Aktif</span>}
                </div>
                <small>Warna tematik hangat (Dark Roasted Coffee) yang hemat baterai dan ramah di mata.</small>
              </div>
            </button>

            <button
              type="button"
              className={`theme-option-card ${theme === 'light' ? 'active' : ''}`}
              onClick={() => handleThemeChange('light')}
            >
              <div className="theme-preview light-preview">
                <div className="preview-nav"/>
                <div className="preview-card"/>
              </div>
              <div className="theme-option-info">
                <div className="theme-title-row">
                  <Sun size={16} />
                  <b>Warm Cream</b>
                  {theme === 'light' && <span className="active-badge"><Check size={12}/> Aktif</span>}
                </div>
                <small>Warna krem estetik bersih dengan kontras jelas untuk area kerja terang.</small>
              </div>
            </button>
          </div>
        </section>

        {/* SEKSI 2: Profil & Cabang Outlet */}
        <section className="panel settings-panel">
          <div className="settings-panel-head">
            <Store size={20} className="panel-head-icon" />
            <div>
              <h3>Profil Kasir & Lokasi Outlet</h3>
              <p>Informasi yang disematkan pada struk dan pencatatan transaksi pesanan.</p>
            </div>
          </div>

          <div className="settings-form-list">
            <div className="settings-input-row">
              <label>Nama Sales / Kasir</label>
              <div className="field-icon">
                <User size={17} />
                <input
                  type="text"
                  value={config.salesName}
                  onChange={e => updateSetting('salesName', e.target.value)}
                  placeholder="Nama Sales"
                />
              </div>
            </div>

            <div className="settings-input-row">
              <label>Nama Cabang Outlet</label>
              <div className="field-icon">
                <Store size={17} />
                <input
                  type="text"
                  value={config.outletName}
                  onChange={e => updateSetting('outletName', e.target.value)}
                  placeholder="Nama Cabang"
                />
              </div>
            </div>

            <div className="settings-input-row">
              <label>Kode Outlet POS</label>
              <div className="field-icon">
                <Smartphone size={17} />
                <input
                  type="text"
                  value={config.outletCode}
                  onChange={e => updateSetting('outletCode', e.target.value)}
                  placeholder="Kode Cabang"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SEKSI 3: Perilaku & Suara Scanner */}
        <section className="panel settings-panel">
          <div className="settings-panel-head">
            <Zap size={20} className="panel-head-icon" />
            <div>
              <h3>Responsivitas & Suara Scanner</h3>
              <p>Optimalkan kecepatan input kasir saat melayani antrean pelanggan.</p>
            </div>
          </div>

          <div className="settings-toggle-list">
            <div className="settings-toggle-row">
              <div className="toggle-info">
                <div className="toggle-label-row">
                  {config.scanSound ? <Volume2 size={17} className="text-accent" /> : <VolumeX size={17} />}
                  <b>Suara Bip Saat Scan SKU</b>
                </div>
                <small>Bunyikan nada konfirmasi audio instan saat kamera berhasil membaca barcode produk.</small>
              </div>
              <label className="switch-control">
                <input
                  type="checkbox"
                  checked={config.scanSound}
                  onChange={e => updateSetting('scanSound', e.target.checked)}
                />
                <span className="switch-slider"/>
              </label>
            </div>

            <div className="settings-toggle-row">
              <div className="toggle-info">
                <div className="toggle-label-row">
                  <Zap size={17} className="text-accent" />
                  <b>Checkout Cepat (Quick Confirm)</b>
                </div>
                <small>Langsung terbitkan pesanan tanpa dialog konfirmasi ganda saat data pelanggan lengkap.</small>
              </div>
              <label className="switch-control">
                <input
                  type="checkbox"
                  checked={config.quickOrderConfirm}
                  onChange={e => updateSetting('quickOrderConfirm', e.target.checked)}
                />
                <span className="switch-slider"/>
              </label>
            </div>
          </div>
        </section>

        {/* SEKSI 4: Manajemen Ruang Kerja & Pesanan Aktif */}
        <section className="panel settings-panel">
          <div className="settings-panel-head">
            <Trash2 size={20} className="panel-head-icon" />
            <div>
              <h3>Penyimpanan Pesanan Aktif</h3>
              <p>Kelola akumulasi draft pesanan lokal untuk menjaga performa aplikasi tetap cepat.</p>
            </div>
          </div>

          <div className="draft-cleanup-card">
            <div>
              <b>Draft Pesanan Tersimpan</b>
              <p>Saat ini terdapat <strong>{drafts.length} pesanan aktif</strong> di memori lokal workspace.</p>
            </div>
            <button
              className="btn-danger"
              disabled={!drafts.length}
              onClick={clearAllDrafts}
            >
              <Trash2 size={16} /> Hapus Semua Draft
            </button>
          </div>
        </section>
      </div>

      {savedNotice && (
        <div className="toast settings-toast">
          <span>✓</span> Pengaturan berhasil disimpan otomatis
        </div>
      )}
    </div>
  )
}

