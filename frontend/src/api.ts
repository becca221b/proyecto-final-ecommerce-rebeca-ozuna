export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '')

export type Categoria = { id: number; nombre: string; descripcion?: string | null }
export type Articulo = {
  id: number
  nombre: string
  precio: number
  cantidadStock: number
  categoria?: Categoria | null
}
export type DetalleOrden = { id: number; cantidad: number; articulo: Articulo }
export type Orden = { id: number; fecha: string; detalles: DetalleOrden[]; costoTotal: number }
export type OrdenDetalleRequest = { articuloId: number; cantidad: number }

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: { ...(init?.body ? { 'Content-Type': 'application/json' } : {}), ...init?.headers },
    })
  } catch {
    throw new Error(`No se pudo conectar con la API en ${API_BASE_URL}. Verifica que Spring Boot esté disponible.`)
  }

  if (!response.ok) {
    const raw = await response.text()
    let message = ''
    if (raw) {
      try {
        const payload: unknown = JSON.parse(raw)
        if (typeof payload === 'string') message = payload
        else if (payload && typeof payload === 'object' && 'message' in payload && typeof payload.message === 'string') {
          message = payload.message
        } else if (payload && typeof payload === 'object' && 'errores' in payload && payload.errores && typeof payload.errores === 'object') {
          message = Object.entries(payload.errores).map(([field, value]) => `${field}: ${String(value)}`).join(' · ')
        }
      } catch {
        message = raw
      }
    }
    throw new ApiError(response.status, message || fallbackMessage(response.status))
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

function fallbackMessage(status: number) {
  if (status === 400) return 'Revisa los datos ingresados e inténtalo nuevamente.'
  if (status === 404) return 'No se encontró el recurso solicitado.'
  if (status === 409) return 'La operación entra en conflicto con el stock o una relación existente.'
  return `La API respondió con el código ${status}.`
}

const json = (method: string, body?: unknown): RequestInit => ({ method, ...(body === undefined ? {} : { body: JSON.stringify(body) }) })

export const api = {
  getArticulos: () => request<Articulo[]>('/api/articulos'),
  getArticulo: (id: number) => request<Articulo>(`/api/articulos/${id}`),
  buscarArticulo: (nombre: string) => request<Articulo>(`/api/articulos/buscar?nombre=${encodeURIComponent(nombre)}`),
  getArticulosPorCategoria: (id: number) => request<Articulo[]>(`/api/articulos/categoria/${id}`),
  crearArticulo: (data: Omit<Articulo, 'id'>) => request<Articulo>('/api/articulos', json('POST', data)),
  actualizarArticulo: (id: number, data: Omit<Articulo, 'id'>) => request<Articulo>(`/api/articulos/${id}`, json('PUT', data)),
  eliminarArticulo: (id: number) => request<void>(`/api/articulos/${id}`, json('DELETE')),
  cambiarPrecio: (id: number, precio: number) => request<unknown>(`/api/articulos/${id}/precio`, json('PATCH', { precio })),
  ingresarStock: (id: number, cantidad: number) => request<void>(`/api/articulos/${id}/stock/ingresar`, json('PATCH', { cantidad })),
  restarStock: (id: number, cantidad: number) => request<void>(`/api/articulos/${id}/stock/restar`, json('PATCH', { cantidad })),
  getCategorias: () => request<Categoria[]>('/api/categorias'),
  buscarCategoria: (nombre: string) => request<Categoria>(`/api/categorias/buscar?nombre=${encodeURIComponent(nombre)}`),
  crearCategoria: (data: Omit<Categoria, 'id'>) => request<Categoria>('/api/categorias', json('POST', data)),
  actualizarCategoria: (id: number, data: Omit<Categoria, 'id'>) => request<Categoria>(`/api/categorias/${id}`, json('PUT', data)),
  eliminarCategoria: (id: number) => request<void>(`/api/categorias/${id}`, json('DELETE')),
  getOrdenes: () => request<Orden[]>('/api/ordenes'),
  getOrden: (id: number) => request<Orden>(`/api/ordenes/${id}`),
  crearOrden: (data: { fecha?: string; detalles: OrdenDetalleRequest[] }) => request<Orden>('/api/ordenes', json('POST', data)),
  actualizarOrden: (id: number, data: { fecha?: string; detalles: OrdenDetalleRequest[] }) => request<Orden>(`/api/ordenes/${id}`, json('PUT', data)),
  actualizarDetalle: (ordenId: number, detalleId: number, cantidad: number) => request<Orden>(`/api/ordenes/${ordenId}/detalles/${detalleId}`, json('PATCH', { cantidad })),
  eliminarDetalle: (ordenId: number, detalleId: number) => request<void>(`/api/ordenes/${ordenId}/detalles/${detalleId}`, json('DELETE')),
}

export function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return 'Ocurrió un error inesperado.'
}
