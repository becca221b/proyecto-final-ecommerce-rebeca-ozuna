import { Boxes, ChartNoAxesCombined, ClipboardList, Layers3, Package, PanelLeftClose, PanelLeftOpen } from 'lucide-react'

export type Section = 'dashboard' | 'articulos' | 'categorias' | 'ordenes'

const items: { id: Section; label: string; icon: typeof Package }[] = [
  { id: 'dashboard', label: 'Resumen', icon: ChartNoAxesCombined },
  { id: 'articulos', label: 'Artículos', icon: Package },
  { id: 'categorias', label: 'Categorías', icon: Layers3 },
  { id: 'ordenes', label: 'Órdenes', icon: ClipboardList },
]

type SidebarProps = { active: Section; onChange: (section: Section) => void; collapsed: boolean; onToggle: () => void; mobileOpen: boolean }

export function Sidebar({ active, onChange, collapsed, onToggle, mobileOpen }: SidebarProps) {
  return <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''} ${mobileOpen ? 'sidebar-mobile-open' : ''}`}>
    <div className="brand"><div className="brand-mark"><Boxes aria-hidden="true" /></div>{!collapsed && <div className="brand-copy"><strong>Mercado</strong><span>Panel de gestión</span></div>}</div>
    <div className="nav-caption">GESTIÓN</div>
    <nav className="main-nav" aria-label="Navegación principal">{items.map(({ id, label, icon: Icon }) => <button key={id} type="button" className={`nav-item ${active === id ? 'nav-item-active' : ''}`} onClick={() => onChange(id)} aria-label={label} aria-current={active === id ? 'page' : undefined} title={collapsed ? label : undefined}><Icon aria-hidden="true" /><span>{label}</span>{active === id && <i />}</button>)}</nav>
    <div className="sidebar-bottom"><div className="connection-card"><span className="connection-dot" />{!collapsed && <div><strong>API REST</strong><span>Spring Boot</span></div>}</div><button className="collapse-button" type="button" onClick={onToggle} aria-label={collapsed ? 'Expandir menú' : 'Contraer menú'}>{collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}{!collapsed && <span>Contraer menú</span>}</button></div>
  </aside>
}
