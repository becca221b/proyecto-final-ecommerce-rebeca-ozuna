import { ClipboardList, House, Layers3, Package, ShoppingBag } from 'lucide-react'

export type Section = 'inicio' | 'articulos' | 'categorias' | 'productos' | 'ordenes'

const items: { id: Section; label: string; icon: typeof Package }[] = [
  { id: 'inicio', label: 'Inicio', icon: House },
  { id: 'articulos', label: 'Artículos', icon: Package },
  { id: 'categorias', label: 'Categorías', icon: Layers3 },
  { id: 'productos', label: 'Productos', icon: ShoppingBag },
  { id: 'ordenes', label: 'Órdenes', icon: ClipboardList },
]

type SidebarProps = { active: Section; onChange: (section: Section) => void; mobileOpen: boolean }

export function Sidebar({ active, onChange, mobileOpen }: SidebarProps) {
  return <nav className={`main-nav ${mobileOpen ? 'main-nav-open' : ''}`} aria-label="Navegación principal">{items.map(({ id, label, icon: Icon }) => <button key={id} type="button" className={`nav-item ${active === id ? 'nav-item-active' : ''}`} onClick={() => onChange(id)} aria-current={active === id ? 'page' : undefined}><Icon aria-hidden="true" /><span>{label}</span></button>)}</nav>
}
