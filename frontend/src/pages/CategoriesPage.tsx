import { useMemo, useState, type FormEvent } from 'react'
import useSWR from 'swr'
import { Layers3, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { api, errorMessage, type Categoria } from '../api'
import { Feedback } from '../components/Feedback'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'

export function CategoriesPage() {
  const { data: categories = [], error, isLoading, mutate } = useSWR<Categoria[]>('categories', api.getCategorias)
  const [search, setSearch] = useState('')
  const [editor, setEditor] = useState<Categoria | 'new' | null>(null)
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState<{ error?: string; success?: string }>({})
  const filtered = useMemo(() => categories.filter((category) => `${category.nombre} ${category.descripcion ?? ''}`.toLowerCase().includes(search.toLowerCase())), [categories, search])

  async function saveCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const payload = { nombre: String(form.get('nombre')).trim(), descripcion: String(form.get('descripcion')).trim() || null }
    setBusy(true); setFeedback({})
    try {
      if (editor !== 'new' && editor) await api.actualizarCategoria(editor.id, payload)
      else await api.crearCategoria(payload)
      await mutate(); setEditor(null); setFeedback({ success: editor === 'new' ? 'Categoría creada.' : 'Categoría actualizada.' })
    } catch (cause) { setFeedback({ error: errorMessage(cause) }) } finally { setBusy(false) }
  }

  async function removeCategory(category: Categoria) {
    if (!window.confirm(`¿Eliminar la categoría “${category.nombre}”?`)) return
    setFeedback({})
    try { await api.eliminarCategoria(category.id); await mutate(); setFeedback({ success: 'Categoría eliminada.' }) }
    catch (cause) { setFeedback({ error: errorMessage(cause) }) }
  }

  return <>
    <PageHeader eyebrow="ORGANIZACIÓN" title="Categorías" description="Agrupa artículos para mantener el catálogo ordenado." action={<button className="button button-primary" onClick={() => setEditor('new')}><Plus aria-hidden="true" />Nueva categoría</button>} />
    <Feedback error={feedback.error || error} success={feedback.success} onDismiss={() => setFeedback({})} />
    <section className="panel table-panel"><div className="table-toolbar"><div className="toolbar-title"><div className="icon-tile icon-tile-peach"><Layers3 /></div><div><h2>Todas las categorías</h2><p>{categories.length} categorías registradas</p></div></div><label className="search-field"><Search aria-hidden="true" /><span className="sr-only">Buscar categorías</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar categoría…" /></label></div>
      <div className="table-scroll"><table><thead><tr><th>CATEGORÍA</th><th>DESCRIPCIÓN</th><th>ID</th><th><span className="sr-only">Acciones</span></th></tr></thead><tbody>{isLoading && <tr><td colSpan={4} className="table-message">Cargando categorías…</td></tr>}{!isLoading && filtered.map((category) => <tr key={category.id}><td><div className="product-cell"><div className="category-avatar"><Layers3 aria-hidden="true" /></div><div><strong>{category.nombre}</strong><span>Categoría de catálogo</span></div></div></td><td className="description-cell">{category.descripcion || <span className="muted">Sin descripción</span>}</td><td><span className="id-code">#{category.id}</span></td><td><div className="row-actions"><button className="icon-button" type="button" aria-label={`Editar ${category.nombre}`} title="Editar categoría" onClick={() => setEditor(category)}><Pencil /></button><button className="icon-button icon-danger" type="button" aria-label={`Eliminar ${category.nombre}`} title="Eliminar categoría" onClick={() => removeCategory(category)}><Trash2 /></button></div></td></tr>)}{!isLoading && filtered.length === 0 && <tr><td colSpan={4} className="table-message">{error ? 'No se pudieron cargar las categorías.' : categories.length ? 'No hay categorías que coincidan.' : 'Todavía no hay categorías registradas.'}</td></tr>}</tbody></table></div>
      <div className="table-footer"><span>Mostrando {filtered.length} de {categories.length} categorías</span><button className="text-button" type="button" onClick={() => void mutate()}>Actualizar lista</button></div>
    </section>
    {editor && <Modal title={editor === 'new' ? 'Nueva categoría' : 'Editar categoría'} description="El nombre es obligatorio. La descripción es opcional." onClose={() => setEditor(null)} onSubmit={saveCategory} busy={busy} submitLabel={editor === 'new' ? 'Crear categoría' : 'Guardar cambios'}><div className="form-grid"><label className="field field-span"><span>Nombre</span><input name="nombre" required maxLength={120} defaultValue={editor === 'new' ? '' : editor.nombre} placeholder="Ej. Accesorios" /></label><label className="field field-span"><span>Descripción <small>(opcional)</small></span><textarea name="descripcion" rows={4} maxLength={500} defaultValue={editor === 'new' ? '' : editor.descripcion ?? ''} placeholder="Describe esta categoría…" /></label></div></Modal>}
  </>
}
