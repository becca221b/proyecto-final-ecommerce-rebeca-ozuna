import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { ArrowUpRight, Search, ShoppingBag, Tag } from 'lucide-react'
import { api, type Articulo, type Categoria } from '../api'
import { Feedback } from '../components/Feedback'
import { PageHeader } from '../components/PageHeader'

type ProductsPageProps = { onManage: () => void }

export function ProductsPage({ onManage }: ProductsPageProps) {
  const { data: articles = [], error, isLoading } = useSWR<Articulo[]>('articles', api.getArticulos)
  const { data: categories = [] } = useSWR<Categoria[]>('categories', api.getCategorias)
  const [query, setQuery] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const filtered = useMemo(() => articles.filter((article) => {
    const matchesName = article.nombre.toLocaleLowerCase().includes(query.toLocaleLowerCase())
    const matchesCategory = !categoryId || String(article.categoria?.id ?? '') === categoryId
    return matchesName && matchesCategory
  }), [articles, categoryId, query])

  return <>
    <PageHeader eyebrow="CATÁLOGO" title="Productos" description="Explora los artículos y encuentra justo lo que buscas." action={<button className="button button-primary" onClick={onManage}>Administrar artículos <ArrowUpRight aria-hidden="true" /></button>} />
    <Feedback error={error} />
    <section className="storefront-toolbar" aria-label="Buscar y filtrar productos"><div className="storefront-results"><strong>{filtered.length}</strong><span>{filtered.length === 1 ? 'producto' : 'productos'}</span></div><div className="storefront-filters"><label className="search-field"><Search aria-hidden="true" /><span className="sr-only">Buscar productos</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar productos…" /></label><label className="select-wrap"><Tag aria-hidden="true" /><span className="sr-only">Filtrar por categoría</span><select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}><option value="">Todas las categorías</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.nombre}</option>)}</select></label></div></section>
    {isLoading ? <div className="catalog-empty">Cargando productos…</div> : filtered.length ? <div className="product-grid">{filtered.map((article) => <article className="product-card" key={article.id}><div className="product-card-top"><div className="product-symbol"><ShoppingBag aria-hidden="true" /></div><span className="product-id">ID {article.id}</span></div><div className="product-card-copy"><div className="product-heading"><span className={`product-category${article.categoria ? '' : ' product-category-muted'}`}>{article.categoria?.nombre ?? 'Sin categoría'}</span><h2>{article.nombre}</h2></div><strong>${article.precio.toFixed(2)}</strong></div><div className="product-card-stock"><span className={article.cantidadStock <= 5 ? 'stock-low' : ''}><i />{article.cantidadStock === 0 ? 'Agotado' : article.cantidadStock <= 5 ? `Quedan ${article.cantidadStock} unidades` : `${article.cantidadStock} unidades disponibles`}</span><button type="button" onClick={onManage} aria-label={`Administrar ${article.nombre}`}><ArrowUpRight aria-hidden="true" /></button></div></article>)}</div> : <div className="catalog-empty"><div className="empty-icon"><ShoppingBag /></div><h2>{articles.length ? 'No encontramos productos' : 'Aún no hay productos para mostrar'}</h2><p>{articles.length ? 'Prueba otra búsqueda o selecciona otra categoría.' : 'Cuando haya artículos en tu catálogo, aparecerán aquí.'}</p></div>}
  </>
}
