import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { ArrowUpRight, Search, ShoppingBag } from 'lucide-react'
import { api, type Articulo } from '../api'
import { Feedback } from '../components/Feedback'
import { PageHeader } from '../components/PageHeader'

type ProductsPageProps = { onManage: () => void }

export function ProductsPage({ onManage }: ProductsPageProps) {
  const { data: articles = [], error, isLoading } = useSWR<Articulo[]>('articles', api.getArticulos)
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => articles.filter((article) => article.nombre.toLocaleLowerCase().includes(query.toLocaleLowerCase())), [articles, query])

  return <>
    <PageHeader eyebrow="CATÁLOGO VISUAL" title="Productos" description="Explora el catálogo publicado desde los artículos conectados a tu API." action={<button className="button button-primary" onClick={onManage}>Administrar artículos <ArrowUpRight aria-hidden="true" /></button>} />
    <Feedback error={error} />
    <section className="catalog-toolbar"><div><span className="catalog-count">{articles.length.toString().padStart(2, '0')}</span><span>productos en catálogo</span></div><label className="search-field"><Search aria-hidden="true" /><span className="sr-only">Buscar productos</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar productos…" /></label></section>
    {isLoading ? <div className="catalog-empty">Cargando catálogo…</div> : filtered.length ? <div className="product-grid">{filtered.map((article, index) => <article className={`product-card product-card-${index % 4}`} key={article.id}><div className="product-art"><span>{article.categoria?.nombre ?? 'CATÁLOGO'}</span><ShoppingBag aria-hidden="true" /><b>{article.nombre.slice(0, 1).toUpperCase()}</b></div><div className="product-card-copy"><div><h2>{article.nombre}</h2><p>{article.categoria?.nombre ?? 'Sin categoría'} <span>·</span> SKU-{String(article.id).padStart(4, '0')}</p></div><strong>${article.precio.toFixed(2)}</strong></div><div className="product-card-stock"><span className={article.cantidadStock <= 5 ? 'stock-low' : ''}>{article.cantidadStock} unidades disponibles</span><button type="button" onClick={onManage} aria-label={`Administrar ${article.nombre}`}><ArrowUpRight /></button></div></article>)}</div> : <div className="catalog-empty"><div className="empty-icon"><ShoppingBag /></div><h2>{articles.length ? 'No encontramos coincidencias' : 'El catálogo está esperando sus artículos'}</h2><p>{articles.length ? 'Prueba otra búsqueda.' : 'Los productos aparecerán aquí cuando existan en tu API.'}</p></div>}
  </>
}
