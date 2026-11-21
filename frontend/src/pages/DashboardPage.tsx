import { ArrowDownRight, ArrowUpRight, Boxes, ClipboardList, Layers3, Package, Plus, ShoppingBag } from 'lucide-react'
import type { Section } from '../components/Sidebar'

type DashboardProps = { onNavigate: (section: Section) => void }

const destinations: { section: Section; index: string; title: string; description: string; icon: typeof Package }[] = [
  { section: 'articulos', index: '01', title: 'Artículos', description: 'Administra precios, cantidades y disponibilidad.', icon: Package },
  { section: 'categorias', index: '02', title: 'Categorías', description: 'Dale estructura a cada parte de tu catálogo.', icon: Layers3 },
  { section: 'productos', index: '03', title: 'Productos', description: 'Explora tu colección en una vista visual.', icon: ShoppingBag },
  { section: 'ordenes', index: '04', title: 'Órdenes', description: 'Consulta pedidos y gestiona sus detalles.', icon: ClipboardList },
]

export function DashboardPage({ onNavigate }: DashboardProps) {
  return <div className="welcome-page">
    <div className="welcome-meta"><span><i /> TU ESPACIO COMERCIAL</span><span>EST. 2026 <b>·</b> SIEMPRE EN MOVIMIENTO</span></div>
    <section className="welcome-hero"><div className="welcome-copy"><p className="eyebrow">UNA MEJOR FORMA DE COMERCIAR</p><h1>Tu negocio,<br /><em>en buenas manos.</em></h1><p className="welcome-description">Todo tu comercio, en un solo lugar. Organiza el catálogo y mantén cada operación fluyendo.</p><button className="button button-primary" onClick={() => onNavigate('articulos')}><Plus aria-hidden="true" /> Ir a artículos</button></div><div className="welcome-visual" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="hero-disc"><Boxes /><span>m</span></div><div className="hero-sticker sticker-coral"><ArrowDownRight /></div><div className="hero-sticker sticker-cream"><ArrowUpRight /></div><span className="visual-index">M / 01</span></div></section>
    <section className="workspace-links"><div className="workspace-heading"><div><p className="eyebrow">TU WORKSPACE</p><h2>¿A dónde vamos?</h2></div><span>ELIGE UN ESPACIO <ArrowDownRight aria-hidden="true" /></span></div><div className="destination-grid">{destinations.map(({ section, index, title, description, icon: Icon }) => <button className="destination-link" key={section} onClick={() => onNavigate(section)}><span className="destination-index">{index}</span><span className="destination-icon"><Icon aria-hidden="true" /></span><span className="destination-copy"><strong>{title}</strong><small>{description}</small></span><ArrowUpRight className="destination-arrow" aria-hidden="true" /></button>)}</div></section>
    <div className="welcome-footer"><span>Hecho para trabajar mejor.</span><span>UNA PLATAFORMA · TODAS TUS OPERACIONES</span></div>
  </div>
}
