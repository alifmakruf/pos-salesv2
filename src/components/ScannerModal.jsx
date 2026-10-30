import React, { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { X, ScanLine, Camera } from 'lucide-react'
export default function ScannerModal({ onClose, onScan }) {
  const scannerRef = useRef(null); const [error, setError] = useState(''); const [manual, setManual] = useState('')
  useEffect(() => {
    let scanner
    const start = async () => {
      try {
        scanner = new Html5Qrcode('pos-qr-reader'); scannerRef.current = scanner
        await scanner.start({ facingMode: 'environment' }, { fps: 10, qrbox: { width: 230, height: 150 }, aspectRatio: 1.4 }, async text => { onScan(text); await scanner.stop().catch(() => {}); onClose() }, () => {})
      } catch { setError('Kamera tidak dapat diakses. Periksa izin kamera atau masukkan SKU secara manual.') }
    }
    start()
    return () => { if (scannerRef.current?.isScanning) scannerRef.current.stop().catch(() => {}) }
  }, [])
  return <div className="modal-overlay" onMouseDown={e => e.target === e.currentTarget && onClose()}><section className="modal scanner-modal"><div className="modal-head"><div><span className="eyebrow">SCAN PRODUCT</span><h2>Pindai kode produk</h2></div><button className="icon-btn" onClick={onClose}><X size={19}/></button></div><div id="pos-qr-reader" className="qr-reader"><div className="scanner-placeholder"><ScanLine size={34}/><span>Mengaktifkan kamera…</span></div></div>{error && <p className="inline-error">{error}</p>}<div className="manual-scan"><label>Atau masukkan SKU / barcode</label><div className="input-with-action"><input value={manual} onChange={e => setManual(e.target.value)} placeholder="Contoh: HX-MJ-001"/><button className="btn-primary" disabled={!manual.trim()} onClick={() => { onScan(manual.trim()); onClose() }}>Cari</button></div></div><p className="muted-note"><Camera size={14}/> Pastikan kamera memiliki izin akses.</p></section></div>
}
