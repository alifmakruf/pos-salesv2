# HEXA POS Sales – Multi-order Workspace

Frontend prototype using React + Vite, Tailwind CSS, Lucide React and HTML5-Qrcode.

## Run

```bash
npm install
npm run dev
```

## Multi-order behavior
- Create a new draft order from the Dashboard.
- Each draft has its own customer data and product cart.
- Active drafts are listed in the sidebar using the customer name; unnamed drafts are labeled Pesanan Baru.
- Select a draft in the sidebar to resume it.
- Draft state remains in app memory while navigating between Dashboard and other screens.
- Confirming a draft creates a pending payment order and removes that draft from the active workspace.

All data is frontend-only mock state. Refreshing the browser clears active drafts; database/API persistence is not implemented yet.
