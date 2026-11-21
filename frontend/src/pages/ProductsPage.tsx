import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { ArrowUpRight, Search, ShoppingBag, Tag } from 'lucide-react'
import { api, type Articulo } from '../api'
import { Feedback } from '../components/Feedback'
import { PageHeader } from '../components/PageHeader'

type ProductsPageProps = { onManage: () => void }

export function ProductsPage({ onManage }: ProductsPageProps) {
  const { data: articles = [], error, isLoading } = useSWR<Articulo[]>('articles', api.getArticulos)
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => articles.filter((article) => article.nombre.toLocaleLowerCase().includes(query.toLocaleLowerCase())), [articles, query])

  return <>
    <PageHeader eyebrow="CATÁLOGO DE ARTÍCULOS" title="Productos" description="Encuentra cada artículo por su nombre, categoría y disponibilidad." action={<button className="button button-primary" onClick={onManage}>Administrar artículos <ArrowUpRight aria-hidden="true" /></button>} />
    <Feedback error={error} />
    <section className="catalog-toolbar"><div><span className="catalog-count">{articles.length.toString().padStart(2, '0')}</span><span>artículos disponibles para explorar</span></div><label className="search-field"><Search aria-hidden="true" /><span className="sr-only">Buscar productos</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nombre…" /></label></section>
    {isLoading ? <div className="catalog-empty">Cargando catálogo…</div> : filtered.length ? <div className="product-grid">{filtered.map((article) => <article className="product-card" key={article.id}><div className="product-card-top"><div className="product-symbol"><ShoppingBag aria-hidden="true" /></div><span className="product-id">ID {String(article.id).padStart(4, '0')}</span></div><div className="product-card-copy"><div className="product-heading">{article.categoria ? <span className="product-category"><Tag aria-hidden="true" />{article.categoria.nombre}</span> : <span className="product-category product-category-muted">Artículo</span>}<h2>{article.nombre}</h2></div><strong>${article.precio.toFixed(2)}</strong></div><div className="product-card-stock"><span className={article.cantidadStock <= 5 ? 'stock-low' : ''}><i />{article.cantidadStock === 0 ? 'Agotado' : article.cantidadStock <= 5 ? `Quedan ${article.cantidadStock} unidades` : `${article.cantidadStock} unidades disponibles`}</span><button type="button" onClick={onManage} aria-label={`Administrar ${article.nombre}`}><ArrowUpRight aria-hidden="true" /></button></div></article>)}</div> : <div className="catalog-empty"><div className="empty-icon"><ShoppingBag /></div><h2>{articles.length ? 'No encontramos coincidencias' : 'El catálogo está esperando sus artículos'}</h2><p>{articles.length ? 'Prueba otra búsqueda.' : 'Los productos aparecerán aquí cuando existan en tu API.'}</p></div>}
  </>
}
