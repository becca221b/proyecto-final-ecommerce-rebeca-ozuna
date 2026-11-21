import { useState } from 'react'
import useSWR from 'swr'
import { Menu } from 'lucide-react'
import { api } from './api'
import { Sidebar, type Section } from './components/Sidebar'
import { ArticlesPage } from './pages/ArticlesPage'
import { CategoriesPage } from './pages/CategoriesPage'
import { DashboardPage } from './pages/DashboardPage'
import { OrdersPage } from './pages/OrdersPage'

const sectionNames: Record<Section, string> = { dashboard: 'Resumen', articulos: 'Artículos', categorias: 'Categorías', ordenes: 'Órdenes' }

function App() {
  const [active, setActive] = useState<Section>('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  useSWR('articles', api.getArticulos)
  useSWR('categories', api.getCategorias)
  useSWR('orders', api.getOrdenes)

  return <div className="app-shell min-h-screen"><Sidebar active={active} onChange={(section) => { setActive(section); setMobileOpen(false) }} collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} mobileOpen={mobileOpen} /><div className="main-area"><header className="topbar"><div className="topbar-location"><button className="mobile-menu" type="button" onClick={() => setMobileOpen((value) => !value)} aria-label="Abrir navegación"><Menu /></button><span>Panel</span><b>/</b><strong>{sectionNames[active]}</strong></div><div className="api-indicator"><span className="connection-dot" /><strong>REST API</strong><span>· {import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}</span></div></header><main className="page-content" key={active}>{active === 'dashboard' && <DashboardPage onNavigate={setActive} />}{active === 'articulos' && <ArticlesPage />}{active === 'categorias' && <CategoriesPage />}{active === 'ordenes' && <OrdersPage />}</main><footer className="app-footer"><span>Mercado · Gestión de inventario</span><span>API REST · {import.meta.env.VITE_API_BASE_URL || 'localhost:8080'}</span></footer></div></div>
}

export default App
