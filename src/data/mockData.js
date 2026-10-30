export const products = [
  { id: 'HX-001', name: 'Meja Belajar Minimalis', category: 'Meja', price: 1250000, stock: 12, color: 'sand', size: '120 × 60 × 75 cm', sku: 'HX-MJ-001', tag: 'Best seller' },
  { id: 'HX-002', name: 'Kursi Kerja Ergonomis', category: 'Kursi', price: 875000, stock: 8, color: 'slate', size: '60 × 58 × 92 cm', sku: 'HX-KR-002', tag: 'Popular' },
  { id: 'HX-003', name: 'Sofa 2 Seater Modern', category: 'Sofa', price: 3250000, stock: 5, color: 'cream', size: '160 × 85 × 80 cm', sku: 'HX-SF-003' },
  { id: 'HX-004', name: 'Lemari Pakaian 2 Pintu', category: 'Lemari', price: 2450000, stock: 6, color: 'wood', size: '100 × 55 × 190 cm', sku: 'HX-LM-004' },
  { id: 'HX-005', name: 'Meja Tamu Scandinavian', category: 'Meja', price: 950000, stock: 14, color: 'oak', size: '90 × 50 × 45 cm', sku: 'HX-MJ-005' },
  { id: 'HX-006', name: 'Kursi Makan Kayu', category: 'Kursi', price: 560000, stock: 0, color: 'brown', size: '45 × 48 × 82 cm', sku: 'HX-KR-006' },
  { id: 'HX-007', name: 'Rak Buku 5 Tingkat', category: 'Rak', price: 780000, stock: 9, color: 'oak', size: '70 × 30 × 180 cm', sku: 'HX-RK-007' },
  { id: 'HX-008', name: 'Sofa L-Shape Premium', category: 'Sofa', price: 5850000, stock: 3, color: 'slate', size: '240 × 160 × 85 cm', sku: 'HX-SF-008' },
]
export const initialOrders = [
  { id: 'ORD-261030-001', customer: 'Rizky Aditya', phone: '081234567890', date: '30 Okt 2026, 08:15', total: 2125000, status: 'Menunggu Pembayaran', items: [{ productId: 'HX-001', qty: 1 }, { productId: 'HX-002', qty: 1 }] },
  { id: 'ORD-261029-014', customer: 'Nadia Putri', phone: '082198765432', date: '29 Okt 2026, 16:42', total: 3250000, status: 'Lunas', items: [{ productId: 'HX-003', qty: 1 }] },
  { id: 'ORD-261029-011', customer: 'Budi Santoso', phone: '085712345678', date: '29 Okt 2026, 14:20', total: 950000, status: 'Dibatalkan', items: [{ productId: 'HX-005', qty: 1 }] },
]
export const rupiah = n => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n || 0)
