import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Sidebar, type Section } from './components/Sidebar'
import { ArticlesPage } from './pages/ArticlesPage'
import { CategoriesPage } from './pages/CategoriesPage'
import { DashboardPage } from './pages/DashboardPage'
import { OrdersPage } from './pages/OrdersPage'
import { ProductsPage } from './pages/ProductsPage'

function App() {
  const [active, setActive] = useState<Section>('inicio')
  const [mobileOpen, setMobileOpen] = useState(false)

  return <div className="app-shell"><header className="topbar"><a className="brand" href="#inicio" onClick={(event) => { event.preventDefault(); setActive('inicio') }}><span className="brand-mark">m.</span><span className="brand-copy"><strong>mercado</strong><small>COMMERCE WORKSPACE</small></span></a><button className="mobile-menu" type="button" onClick={() => setMobileOpen((value) => !value)} aria-label="Abrir navegación"><Menu /></button><Sidebar active={active} onChange={(section) => { setActive(section); setMobileOpen(false) }} mobileOpen={mobileOpen} /><div className="api-indicator"><span className="connection-dot" /><strong>Conectado</strong><span>Spring API</span></div></header><main className="page-content" key={active}>{active === 'inicio' && <DashboardPage onNavigate={setActive} />}{active === 'articulos' && <ArticlesPage />}{active === 'categorias' && <CategoriesPage />}{active === 'productos' && <ProductsPage onManage={() => setActive('articulos')} />}{active === 'ordenes' && <OrdersPage />}</main><footer className="app-footer"><span>mercado · Espacio comercial</span><span>API REST · {import.meta.env.VITE_API_BASE_URL || 'localhost:8080'}</span></footer></div>
}

export default App
