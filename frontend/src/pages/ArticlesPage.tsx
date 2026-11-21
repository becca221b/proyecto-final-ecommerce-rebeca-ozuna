import { useMemo, useState, type FormEvent } from 'react'
import useSWR from 'swr'
import { ArrowDownToLine, ArrowUpFromLine, Boxes, MoreHorizontal, Pencil, Plus, Search, Tag, Trash2 } from 'lucide-react'
import { api, errorMessage, type Articulo, type Categoria } from '../api'
import { Feedback } from '../components/Feedback'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'

type Editor = { mode: 'article'; article?: Articulo } | { mode: 'stock'; article: Articulo; operation: 'in' | 'out' } | { mode: 'price'; article: Articulo } | null

export function ArticlesPage() {
  const { data: articles = [], error, isLoading, mutate } = useSWR<Articulo[]>('articles', api.getArticulos)
  const { data: categories = [] } = useSWR<Categoria[]>('categories', api.getCategorias)
  const [query, setQuery] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [editor, setEditor] = useState<Editor>(null)
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState<{ error?: string; success?: string }>({})

  const visibleArticles = useMemo(() => articles.filter((article) => {
    const matchesQuery = article.nombre.toLocaleLowerCase().includes(query.toLocaleLowerCase())
    const matchesCategory = !categoryId || String(article.categoria?.id ?? '') === categoryId
    return matchesQuery && matchesCategory
  }), [articles, categoryId, query])

  async function submitArticle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (editor?.mode !== 'article') return
    const form = new FormData(event.currentTarget)
    const category = form.get('categoria')
    const payload = {
      nombre: String(form.get('nombre')).trim(),
      precio: Number(form.get('precio')),
      cantidadStock: Number(form.get('cantidadStock')),
      categoria: category ? { id: Number(category) } as Categoria : null,
    }
    setBusy(true); setFeedback({})
    try {
      if (editor.article) await api.actualizarArticulo(editor.article.id, payload)
      else await api.crearArticulo(payload)
      await mutate(); setEditor(null); setFeedback({ success: editor.article ? 'Artículo actualizado.' : 'Artículo creado.' })
    } catch (cause) { setFeedback({ error: errorMessage(cause) }) } finally { setBusy(false) }
  }

  async function submitStock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (editor?.mode !== 'stock') return
    const quantity = Number(new FormData(event.currentTarget).get('cantidad'))
    setBusy(true); setFeedback({})
    try {
      if (editor.operation === 'in') await api.ingresarStock(editor.article.id, quantity)
      else await api.restarStock(editor.article.id, quantity)
      await mutate(); setEditor(null); setFeedback({ success: editor.operation === 'in' ? 'Stock ingresado correctamente.' : 'Stock descontado correctamente.' })
    } catch (cause) { setFeedback({ error: errorMessage(cause) }) } finally { setBusy(false) }
  }

  async function submitPrice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (editor?.mode !== 'price') return
    const price = Number(new FormData(event.currentTarget).get('precio'))
    setBusy(true); setFeedback({})
    try { await api.cambiarPrecio(editor.article.id, price); await mutate(); setEditor(null); setFeedback({ success: 'Precio actualizado correctamente.' }) }
    catch (cause) { setFeedback({ error: errorMessage(cause) }) } finally { setBusy(false) }
  }

  async function removeArticle(article: Articulo) {
    if (!window.confirm(`¿Eliminar “${article.nombre}”?`)) return
    setFeedback({})
    try { await api.eliminarArticulo(article.id); await mutate(); setFeedback({ success: 'Artículo eliminado.' }) }
    catch (cause) { setFeedback({ error: errorMessage(cause) }) }
  }

  return <>
    <PageHeader eyebrow="INVENTARIO" title="Artículos" description="Administra tu catálogo, categorías y disponibilidad de stock." action={<button className="button button-primary" onClick={() => setEditor({ mode: 'article' })}><Plus aria-hidden="true" />Nuevo artículo</button>} />
    <Feedback error={feedback.error || error} success={feedback.success} onDismiss={() => setFeedback({})} />
    <section className="panel table-panel">
      <div className="table-toolbar"><div className="toolbar-title"><div className="icon-tile icon-tile-lilac"><Boxes /></div><div><h2>Catálogo</h2><p>{articles.length} artículos registrados</p></div></div><div className="toolbar-filters"><label className="search-field"><Search aria-hidden="true" /><span className="sr-only">Buscar artículo</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar artículo…" /></label><label className="select-wrap"><Tag aria-hidden="true" /><span className="sr-only">Filtrar por categoría</span><select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}><option value="">Todas las categorías</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.nombre}</option>)}</select></label></div></div>
      <div className="table-scroll"><table><thead><tr><th>ARTÍCULO</th><th>CATEGORÍA</th><th>PRECIO</th><th>STOCK</th><th>ESTADO</th><th><span className="sr-only">Acciones</span></th></tr></thead><tbody>
        {isLoading && <tr><td colSpan={6} className="table-message">Cargando artículos…</td></tr>}
        {!isLoading && visibleArticles.map((article) => <tr key={article.id}><td><div className="product-cell"><div className="product-avatar">{article.nombre.slice(0, 1).toUpperCase()}</div><div><strong>{article.nombre}</strong><span>SKU-{String(article.id).padStart(4, '0')}</span></div></div></td><td>{article.categoria ? <span className="category-pill">{article.categoria.nombre}</span> : <span className="muted">Sin categoría</span>}</td><td><strong className="price">${article.precio.toFixed(2)}</strong></td><td>{article.cantidadStock}</td><td><span className={`status-pill ${article.cantidadStock === 0 ? 'status-danger' : article.cantidadStock <= 5 ? 'status-warning' : 'status-success'}`}><i />{article.cantidadStock === 0 ? 'Agotado' : article.cantidadStock <= 5 ? 'Stock bajo' : 'Disponible'}</span></td><td><div className="row-actions"><button className="icon-button" type="button" title="Editar artículo" aria-label={`Editar ${article.nombre}`} onClick={() => setEditor({ mode: 'article', article })}><Pencil /></button><button className="icon-button" type="button" title="Cambiar precio" aria-label={`Cambiar precio de ${article.nombre}`} onClick={() => setEditor({ mode: 'price', article })}><span className="currency-icon">$</span></button><button className="icon-button" type="button" title="Ingresar stock" aria-label={`Ingresar stock de ${article.nombre}`} onClick={() => setEditor({ mode: 'stock', article, operation: 'in' })}><ArrowDownToLine /></button><button className="icon-button" type="button" title="Restar stock" aria-label={`Restar stock de ${article.nombre}`} onClick={() => setEditor({ mode: 'stock', article, operation: 'out' })}><ArrowUpFromLine /></button><button className="icon-button icon-danger" type="button" title="Eliminar artículo" aria-label={`Eliminar ${article.nombre}`} onClick={() => removeArticle(article)}><Trash2 /></button></div></td></tr>)}
        {!isLoading && visibleArticles.length === 0 && <tr><td colSpan={6} className="table-message">{error ? 'No se pudieron cargar los artículos.' : articles.length ? 'No hay artículos que coincidan con estos filtros.' : 'Todavía no hay artículos en el catálogo.'}</td></tr>}
      </tbody></table></div><div className="table-footer"><span>Mostrando {visibleArticles.length} de {articles.length} artículos</span><button className="text-button" type="button" onClick={() => void mutate()}><MoreHorizontal aria-hidden="true" />Actualizar lista</button></div>
    </section>

    {editor?.mode === 'article' && <Modal title={editor.article ? 'Editar artículo' : 'Nuevo artículo'} description="Los campos se guardan directamente en el catálogo de la API." onClose={() => setEditor(null)} onSubmit={submitArticle} busy={busy} submitLabel={editor.article ? 'Guardar artículo' : 'Crear artículo'}><div className="form-grid"><label className="field field-span"><span>Nombre del artículo</span><input name="nombre" required maxLength={120} defaultValue={editor.article?.nombre} placeholder="Ej. Teclado mecánico" /></label><label className="field"><span>Precio</span><div className="input-affix"><b>$</b><input name="precio" type="number" min="0.01" step="0.01" required defaultValue={editor.article?.precio} /></div></label><label className="field"><span>Stock inicial</span><input name="cantidadStock" type="number" min="0" step="1" required defaultValue={editor.article?.cantidadStock ?? 0} /></label><label className="field field-span"><span>Categoría <small>(opcional)</small></span><select name="categoria" defaultValue={editor.article?.categoria?.id ?? ''}><option value="">Sin categoría</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.nombre}</option>)}</select></label></div></Modal>}
    {editor?.mode === 'stock' && <Modal title={editor.operation === 'in' ? 'Ingresar stock' : 'Restar stock'} description={`${editor.article.nombre} · Stock actual: ${editor.article.cantidadStock}`} onClose={() => setEditor(null)} onSubmit={submitStock} busy={busy} submitLabel={editor.operation === 'in' ? 'Ingresar unidades' : 'Restar unidades'}><label className="field"><span>Cantidad de unidades</span><input name="cantidad" type="number" min="0" step="1" required autoFocus /></label></Modal>}
    {editor?.mode === 'price' && <Modal title="Actualizar precio" description={editor.article.nombre} onClose={() => setEditor(null)} onSubmit={submitPrice} busy={busy} submitLabel="Guardar precio"><label className="field"><span>Nuevo precio</span><div className="input-affix"><b>$</b><input name="precio" type="number" min="0.01" step="0.01" required defaultValue={editor.article.precio} /></div></label></Modal>}
  </>
}
