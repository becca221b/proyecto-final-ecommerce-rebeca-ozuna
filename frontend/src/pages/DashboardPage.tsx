import useSWR from 'swr'
import { ArrowDownRight, ArrowUpRight, Boxes, ClipboardList, Layers3, Package, Plus } from 'lucide-react'
import { api, type Articulo, type Categoria, type Orden } from '../api'
import { PageHeader } from '../components/PageHeader'
import { Feedback } from '../components/Feedback'
import type { Section } from '../components/Sidebar'

type DashboardProps = { onNavigate: (section: Section) => void }

export function DashboardPage({ onNavigate }: DashboardProps) {
  const { data: articles, error: articleError } = useSWR<Articulo[]>('articles', api.getArticulos)
  const { data: categories, error: categoryError } = useSWR<Categoria[]>('categories', api.getCategorias)
  const { data: orders, error: orderError } = useSWR<Orden[]>('orders', api.getOrdenes)
  const stock = articles?.reduce((sum, article) => sum + article.cantidadStock, 0)
  const inventoryValue = articles?.reduce((sum, article) => sum + article.precio * article.cantidadStock, 0)
  const lowStockItems = articles?.filter((article) => article.cantidadStock <= 5) ?? []
  const lowStock = lowStockItems.length
  const recentOrders = [...(orders ?? [])].sort((a, b) => b.id - a.id).slice(0, 4)

  return <>
    <PageHeader eyebrow="VISTA GENERAL" title="Tu negocio, en movimiento." description="Una lectura clara de lo que pasa en tu catálogo hoy." action={<button className="button button-primary" onClick={() => onNavigate('articulos')}><Plus aria-hidden="true" />Nuevo artículo</button>} />
    <Feedback error={articleError || categoryError || orderError} />
    <section className="dashboard-intro" aria-label="Resumen del espacio de trabajo">
      <div className="dashboard-intro-copy"><span className="dashboard-kicker"><i /> ESPACIO DE TRABAJO</span><h2>Todo lo importante,<br />a primera vista.</h2><p>Tu catálogo y la actividad reciente, siempre en contexto.</p></div>
      <div className="intro-stat"><span>CATÁLOGO</span><strong>{articles?.length === undefined ? '—' : articles.length.toLocaleString('es-AR')}</strong><small>artículos activos</small></div>
      <div className="intro-stat intro-stat-accent"><span>VALOR EN STOCK</span><strong>{inventoryValue === undefined ? '—' : `$${inventoryValue.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`}</strong><small>según precio actual</small></div>
      <div className="intro-mark" aria-hidden="true"><Boxes /></div>
    </section>
    <section className="metrics-grid" aria-label="Indicadores del inventario"><Metric icon={<Package />} label="Artículos" value={articles?.length} tone="lilac" note="En el catálogo" /><Metric icon={<Layers3 />} label="Categorías" value={categories?.length} tone="peach" note="Grupos creados" /><Metric icon={<Boxes />} label="Unidades en stock" value={stock} tone="mint" note={articles ? lowStock ? `${lowStock} con stock bajo` : 'Todo en orden' : 'Esperando API'} alert={Boolean(articles && lowStock)} /><Metric icon={<ClipboardList />} label="Órdenes" value={orders?.length} tone="blue" note="Pedidos registrados" /></section>
    <div className="dashboard-grid"><section className="panel value-panel"><div className="section-heading"><div><p className="eyebrow">INVENTARIO</p><h2>Valor del stock</h2></div><div className="icon-tile icon-tile-lilac"><Boxes /></div></div><strong className="value-total">{inventoryValue === undefined ? '—' : `$${inventoryValue.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</strong><div className="value-caption"><span className="trend-icon"><ArrowUpRight /></span><span>Calculado con el precio actual de cada artículo</span></div><div className="inventory-note"><span>{articles?.length ?? '—'} productos</span><span>{stock ?? '—'} unidades</span><span>Valuación actual</span></div></section>
      <section className="panel stock-panel"><div className="section-heading"><div><p className="eyebrow">ATENCIÓN</p><h2>Revisar stock</h2></div><button className="text-button" onClick={() => onNavigate('articulos')}>Ver catálogo <ArrowUpRight /></button></div><p className="stock-intro">Artículos con cinco unidades o menos disponibles.</p>{lowStock ? <div className="low-stock-list">{lowStockItems.slice(0, 4).map((article) => <div className="low-stock-item" key={article.id}><div className="line-avatar">{article.nombre.slice(0, 1).toUpperCase()}</div><div><strong>{article.nombre}</strong><span>{article.categoria?.nombre ?? 'Sin categoría'}</span></div><span className={`stock-count ${article.cantidadStock === 0 ? 'stock-count-zero' : ''}`}>{article.cantidadStock} un.</span></div>)}</div> : articles ? <div className="stock-clear"><div><ArrowDownRight /></div><p>Todo abastecido</p><span>No hay artículos con stock crítico.</span></div> : <div className="stock-clear"><p>Sin datos de stock</p><span>Conecta la API para consultar disponibilidad.</span></div>}</section></div>
    <section className="panel recent-panel"><div className="table-toolbar"><div className="toolbar-title"><div className="icon-tile icon-tile-mint"><ClipboardList /></div><div><h2>Órdenes recientes</h2><p>Últimos pedidos registrados</p></div></div><button className="text-button" onClick={() => onNavigate('ordenes')}>Ver todas <ArrowUpRight /></button></div>{orders === undefined ? <div className="recent-empty">No se pudieron cargar las órdenes.</div> : recentOrders.length ? <div className="recent-orders">{recentOrders.map((order) => <div className="recent-order" key={order.id}><div className="order-icon"><ClipboardList /></div><div><strong>Orden #{String(order.id).padStart(4, '0')}</strong><span>{order.fecha || 'Sin fecha'} · {order.detalles.length} {order.detalles.length === 1 ? 'artículo' : 'artículos'}</span></div><strong className="price">${Number(order.costoTotal ?? 0).toFixed(2)}</strong></div>)}</div> : <div className="recent-empty">Las órdenes que crees aparecerán aquí.</div>}</section>
  </>
}

function Metric({ icon, label, value, tone, note, alert = false }: { icon: React.ReactNode; label: string; value?: number; tone: string; note: string; alert?: boolean }) {
  return <article className="metric-card"><div className={`icon-tile icon-tile-${tone}`}>{icon}</div><span className="metric-label">{label}</span><strong className="metric-value">{value === undefined ? '—' : value.toLocaleString('es-AR')}</strong><span className={`metric-note ${alert ? 'metric-note-alert' : ''}`}>{note}</span></article>
}
