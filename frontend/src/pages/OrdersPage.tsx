import { useState, type FormEvent } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import { ClipboardList, Minus, Plus, RefreshCw, Trash2 } from 'lucide-react'
import { api, errorMessage, type Articulo, type Orden, type OrdenDetalleRequest } from '../api'
import { Feedback } from '../components/Feedback'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'

type DraftDetail = { articuloId: string; cantidad: string }
type Editor = { order: Orden | null; details: DraftDetail[] } | null

export function OrdersPage() {
  const { data: orders = [], error, isLoading, mutate } = useSWR<Orden[]>('orders', api.getOrdenes)
  const { data: articles = [] } = useSWR<Articulo[]>('articles', api.getArticulos)
  const { mutate: mutateCache } = useSWRConfig()
  const [editor, setEditor] = useState<Editor>(null)
  const [quantityTarget, setQuantityTarget] = useState<{ orderId: number; detailId: number; itemName: string; quantity: number } | null>(null)
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState<{ error?: string; success?: string }>({})

  function newOrder() {
    setEditor({ order: null, details: [{ articuloId: '', cantidad: '1' }] })
  }

  function editOrder(order: Orden) {
    setEditor({ order, details: order.detalles.map((detail) => ({ articuloId: String(detail.articulo.id), cantidad: String(detail.cantidad) })) })
  }

  function updateDraft(index: number, key: keyof DraftDetail, value: string) {
    setEditor((current) => current ? { ...current, details: current.details.map((line, lineIndex) => lineIndex === index ? { ...line, [key]: value } : line) } : current)
  }

  async function saveOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!editor) return
    const form = new FormData(event.currentTarget)
    const details: OrdenDetalleRequest[] = editor.details.map((line) => ({ articuloId: Number(line.articuloId), cantidad: Number(line.cantidad) }))
    if (!details.length || details.some((detail) => !detail.articuloId || detail.cantidad < 1)) {
      setFeedback({ error: 'Agrega al menos un artículo y asegúrate de que cada cantidad sea mayor que cero.' })
      return
    }
    const dateValue = String(form.get('fecha') || '')
    const payload = { ...(dateValue ? { fecha: dateValue } : {}), detalles: details }
    setBusy(true); setFeedback({})
    try {
      if (editor.order) await api.actualizarOrden(editor.order.id, payload)
      else await api.crearOrden(payload)
      await Promise.all([mutate(), mutateCache('articles')])
      setEditor(null); setFeedback({ success: editor.order ? 'Detalles de la orden reemplazados; stock actualizado.' : 'Orden creada y stock reservado.' })
    } catch (cause) { setFeedback({ error: errorMessage(cause) }) } finally { setBusy(false) }
  }

  async function updateQuantity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!quantityTarget) return
    const quantity = Number(new FormData(event.currentTarget).get('cantidad'))
    setBusy(true); setFeedback({})
    try { await api.actualizarDetalle(quantityTarget.orderId, quantityTarget.detailId, quantity); await Promise.all([mutate(), mutateCache('articles')]); setQuantityTarget(null); setFeedback({ success: 'Cantidad actualizada y stock ajustado.' }) }
    catch (cause) { setFeedback({ error: errorMessage(cause) }) } finally { setBusy(false) }
  }

  async function removeDetail(orderId: number, detailId: number) {
    if (!window.confirm('¿Eliminar este detalle? Las unidades se devolverán al stock.')) return
    setFeedback({})
    try { await api.eliminarDetalle(orderId, detailId); await Promise.all([mutate(), mutateCache('articles')]); setFeedback({ success: 'Detalle eliminado; el stock fue devuelto.' }) }
    catch (cause) { setFeedback({ error: errorMessage(cause) }) }
  }

  return <>
    <PageHeader eyebrow="VENTAS" title="Órdenes" description="Crea pedidos y administra sus detalles y reservas de stock." action={<button className="button button-primary" onClick={newOrder}><Plus aria-hidden="true" />Nueva orden</button>} />
    <Feedback error={feedback.error || error} success={feedback.success} onDismiss={() => setFeedback({})} />
    <section className="panel table-panel"><div className="table-toolbar"><div className="toolbar-title"><div className="icon-tile icon-tile-mint"><ClipboardList /></div><div><h2>Historial de órdenes</h2><p>{orders.length} órdenes registradas</p></div></div><button className="button button-quiet button-small" type="button" onClick={() => void mutate()}><RefreshCw aria-hidden="true" />Actualizar</button></div>
      <div className="orders-list">{isLoading && <div className="table-message">Cargando órdenes…</div>}{!isLoading && orders.map((order) => <article className="order-card" key={order.id}><div className="order-topline"><div className="order-reference"><div className="order-icon"><ClipboardList /></div><div><strong>Orden #{String(order.id).padStart(4, '0')}</strong><span>{order.fecha || 'Sin fecha'}</span></div></div><div className="order-total"><span>Total</span><strong>${Number(order.costoTotal ?? order.detalles.reduce((total, detail) => total + detail.articulo.precio * detail.cantidad, 0)).toFixed(2)}</strong></div><button className="button button-quiet button-small" type="button" onClick={() => editOrder(order)}><RefreshCw aria-hidden="true" />Reemplazar detalles</button></div>
        <div className="order-lines">{order.detalles.length === 0 ? <div className="order-empty">Esta orden no tiene detalles.</div> : order.detalles.map((detail) => <div className="order-line" key={detail.id}><div className="line-avatar">{detail.articulo.nombre.slice(0, 1).toUpperCase()}</div><div className="line-name"><strong>{detail.articulo.nombre}</strong><span>${detail.articulo.precio.toFixed(2)} × {detail.cantidad}</span></div><div className="line-subtotal">${(detail.articulo.precio * detail.cantidad).toFixed(2)}</div><button className="text-button line-edit" type="button" onClick={() => setQuantityTarget({ orderId: order.id, detailId: detail.id, itemName: detail.articulo.nombre, quantity: detail.cantidad })}>Editar cantidad</button><button className="icon-button icon-danger" type="button" aria-label={`Eliminar ${detail.articulo.nombre} de orden ${order.id}`} title="Eliminar detalle y devolver stock" onClick={() => removeDetail(order.id, detail.id)}><Trash2 /></button></div>)}</div></article>)}{!isLoading && orders.length === 0 && <div className="empty-state"><div className="empty-icon"><ClipboardList /></div><h3>{error ? 'No se pudieron cargar las órdenes' : 'Aún no hay órdenes'}</h3><p>{error ? 'La API no devolvió el historial.' : 'Cuando registres una orden, aparecerá aquí junto con sus detalles.'}</p>{!error && <button className="button button-primary" onClick={newOrder}><Plus aria-hidden="true" />Crear primera orden</button>}</div>}</div>
    </section>
    {editor && <Modal title={editor.order ? `Reemplazar detalles · Orden #${editor.order.id}` : 'Crear orden'} description="Al confirmar, la API ajustará el stock de forma transaccional." onClose={() => setEditor(null)} onSubmit={saveOrder} busy={busy} submitLabel={editor.order ? 'Guardar reemplazo' : 'Crear orden'}><div className="form-grid"><label className="field field-span"><span>Fecha <small>(opcional)</small></span><input name="fecha" type="date" defaultValue={editor.order?.fecha ?? ''} /></label><div className="field field-span"><span>Detalles de la orden</span><div className="order-draft">{editor.details.map((line, index) => <div className="draft-row" key={index}><label className="field"><span className="sr-only">Artículo {index + 1}</span><select required value={line.articuloId} onChange={(event) => updateDraft(index, 'articuloId', event.target.value)}><option value="">Seleccionar artículo…</option>{articles.map((article) => <option key={article.id} value={article.id}>{article.nombre} · ${article.precio.toFixed(2)} · stock {article.cantidadStock}</option>)}</select></label><label className="field"><span className="sr-only">Cantidad {index + 1}</span><input type="number" min="1" step="1" required value={line.cantidad} onChange={(event) => updateDraft(index, 'cantidad', event.target.value)} /></label><button className="icon-button icon-danger" type="button" aria-label={`Quitar línea ${index + 1}`} disabled={editor.details.length === 1} onClick={() => setEditor((current) => current ? { ...current, details: current.details.filter((_, lineIndex) => lineIndex !== index) } : current)}><Minus /></button></div>)}</div><button className="button button-quiet button-small add-line" type="button" onClick={() => setEditor((current) => current ? { ...current, details: [...current.details, { articuloId: '', cantidad: '1' }] } : current)}><Plus aria-hidden="true" />Agregar artículo</button></div></div></Modal>}
    {quantityTarget && <Modal title="Editar cantidad" description={`${quantityTarget.itemName} · Cantidad actual: ${quantityTarget.quantity}`} onClose={() => setQuantityTarget(null)} onSubmit={updateQuantity} busy={busy} submitLabel="Actualizar cantidad"><label className="field"><span>Nueva cantidad</span><input name="cantidad" type="number" min="1" step="1" required defaultValue={quantityTarget.quantity} autoFocus /></label><p className="form-note">Solo cambia la cantidad. El artículo asociado no se puede reemplazar desde esta acción.</p></Modal>}
  </>
}
