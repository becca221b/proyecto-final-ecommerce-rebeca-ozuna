# Endpoints de la API

## Información general

- **URL base local:** `http://localhost:8080`
- **Prefijos:** `/api/articulos`, `/api/categorias` y `/api/ordenes`
- **Formato:** JSON (`Content-Type: application/json`)
- **CORS:** el controlador permite solicitudes desde cualquier origen.

La API expone operaciones para artículos, categorías y órdenes.

## Artículos

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/articulos` | Devuelve todos los artículos. |
| `GET` | `/api/articulos/{id}` | Devuelve el artículo con ese ID. |
| `GET` | `/api/articulos/buscar?nombre={texto}` | Busca el primer artículo cuyo nombre contiene el texto, sin distinguir mayúsculas. |
| `GET` | `/api/articulos/categoria/{categoriaId}` | Devuelve los artículos de una categoría. |
| `POST` | `/api/articulos` | Guarda un artículo. |
| `PUT` | `/api/articulos/{id}` | Actualiza el artículo usando el ID de la ruta. |
| `DELETE` | `/api/articulos/{id}` | Elimina el artículo. |
| `PATCH` | `/api/articulos/{id}/precio` | Cambia el precio. |
| `PATCH` | `/api/articulos/{id}/stock/ingresar` | Suma unidades al stock. |
| `PATCH` | `/api/articulos/{id}/stock/restar` | Resta unidades del stock. |

### `GET /api/articulos`

Devuelve `200 OK` y una lista JSON. Si no hay artículos, la lista está vacía.

### `GET /api/articulos/{id}`

Devuelve `200 OK` con el artículo si existe; si no existe, devuelve `404 Not Found`.

Ejemplo: `GET http://localhost:8080/api/articulos/1`

### Búsquedas de artículos

- `GET /api/articulos/buscar?nombre=teclado` devuelve el primer artículo cuyo nombre contiene el texto, sin distinguir mayúsculas; devuelve `404 Not Found` si no encuentra coincidencias.
- `GET /api/articulos/categoria/2` devuelve la lista de artículos de la categoría indicada. La lista estará vacía si no hay coincidencias.

### `POST /api/articulos`

Recibe un objeto con los datos del artículo y lo guarda. El ID se genera en la base de datos. El controlador devuelve el artículo guardado. `nombre` no puede estar vacío, `precio` debe ser mayor que cero y `cantidadStock` debe ser cero o mayor.

Ejemplo de cuerpo:

```json
{
  "nombre": "Teclado",
  "precio": 29.99,
  "cantidadStock": 10,
  "categoria": {
    "id": 2
  }
}
```

El campo `categoria` puede omitirse o ser `null` si el artículo no tiene categoría. La respuesta actual del controlador es `200 OK`.

### `PUT /api/articulos/{id}`

Recibe los datos del artículo y los guarda en el registro identificado por la ruta. El ID de la ruta es la única fuente de identidad; no envíes `id` en el cuerpo. Los campos se validan igual que en `POST`.

Ejemplo: `PUT http://localhost:8080/api/articulos/1`

```json
{
  "nombre": "Teclado mecánico",
  "precio": 49.99,
  "cantidadStock": 8,
  "categoria": {
    "id": 2
  }
}
```

Devuelve `200 OK` con el artículo guardado. Si el ID de la ruta no existe, devuelve `404 Not Found`; si los datos no cumplen las validaciones, devuelve `400 Bad Request`.

### `DELETE /api/articulos/{id}`

Elimina el artículo y devuelve `204 No Content`. Si el ID no existe, devuelve `404 Not Found`.

### `PATCH /api/articulos/{id}/precio`

Actualiza el precio y devuelve `204 No Content`. El precio debe ser mayor que cero; de lo contrario, Bean Validation devuelve `400 Bad Request`. Si el artículo no existe, devuelve `404 Not Found`.

```json
{
  "precio": 49.99
}
```

### `PATCH /api/articulos/{id}/stock/ingresar`

Suma la cantidad indicada al stock y devuelve `204 No Content`. La cantidad debe ser cero o mayor; si es negativa, Bean Validation devuelve `400 Bad Request`. Si el artículo no existe, devuelve `404 Not Found`.

```json
{
  "cantidad": 5
}
```

### `PATCH /api/articulos/{id}/stock/restar`

Resta la cantidad indicada y devuelve `204 No Content`. Si la cantidad es negativa, Bean Validation devuelve `400 Bad Request`; si no hay stock suficiente, devuelve `409 Conflict` con el mensaje de error; si el artículo no existe, devuelve `404 Not Found`.

```json
{
  "cantidad": 2
}
```

## Categorías

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/categorias` | Devuelve todas las categorías. |
| `GET` | `/api/categorias/{id}` | Devuelve una categoría. |
| `GET` | `/api/categorias/buscar?nombre={texto}` | Busca la primera categoría cuyo nombre contiene el texto. |
| `POST` | `/api/categorias` | Crea una categoría. |
| `PUT` | `/api/categorias/{id}` | Actualiza una categoría; el ID de la ruta es la única fuente de identidad. |
| `DELETE` | `/api/categorias/{id}` | Elimina una categoría. |

El cuerpo de `POST` y `PUT` tiene este formato; `nombre` es obligatorio y no puede estar vacío:

```json
{
  "nombre": "Periféricos",
  "descripcion": "Accesorios para computadoras"
}
```

`POST` devuelve `201 Created`; `PUT` devuelve `200 OK`; `DELETE` devuelve `204 No Content`. Las búsquedas sin resultado y los IDs inexistentes devuelven `404 Not Found`. Si una categoría está asociada a artículos, intentar eliminarla devuelve `409 Conflict`.

La búsqueda por nombre no distingue mayúsculas y devuelve la primera coincidencia parcial.

## Órdenes

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/ordenes` | Devuelve todas las órdenes con sus detalles. |
| `GET` | `/api/ordenes/{id}` | Devuelve una orden con sus detalles. |
| `POST` | `/api/ordenes` | Crea una orden y descuenta el stock de sus artículos. |
| `PUT` | `/api/ordenes/{id}` | Reemplaza los detalles y ajusta el stock. |
| `PATCH` | `/api/ordenes/{ordenId}/detalles/{detalleId}` | Actualiza la cantidad de un detalle y ajusta el stock. |
| `DELETE` | `/api/ordenes/{ordenId}/detalles/{detalleId}` | Elimina un detalle y devuelve su stock. |

Ejemplo de cuerpo para `POST` o `PUT`:

```json
{
  "fecha": "2026-11-20",
  "detalles": [
    {
      "articuloId": 1,
      "cantidad": 2
    },
    {
      "articuloId": 3,
      "cantidad": 1
    }
  ]
}
```

`fecha` es opcional: al crear la orden, si se omite, se usa la fecha actual; al actualizar, se conserva la fecha existente. `detalles` debe contener al menos un elemento. Cada `articuloId` y `cantidad` debe ser mayor que cero.

`POST` devuelve `201 Created`; `PUT` devuelve `200 OK`. En ambos casos, si algún artículo no existe, la respuesta es `404 Not Found`; si el stock no alcanza, devuelve `409 Conflict` y no se guardan cambios parciales. Al actualizar, primero se devuelve al stock lo reservado por la orden anterior y luego se descuenta el nuevo detalle, todo dentro de una transacción. No se expone un endpoint para eliminar órdenes.

### `PATCH /api/ordenes/{ordenId}/detalles/{detalleId}`

Actualiza únicamente la cantidad del detalle indicado. El artículo del detalle no cambia. El cuerpo debe contener una cantidad mayor que cero:

```json
{
  "cantidad": 3
}
```

Si la nueva cantidad es mayor que la anterior, se descuenta del stock la diferencia; si es menor, se devuelve la diferencia. Si la cantidad es la misma, el stock no cambia. Devuelve `200 OK` con la orden actualizada. Si la orden o el detalle no existen, o el detalle no pertenece a esa orden, devuelve `404 Not Found`; si la cantidad no es válida, devuelve `400 Bad Request`; si no hay stock suficiente para aumentar la cantidad, devuelve `409 Conflict` y no se guardan cambios parciales.

### `DELETE /api/ordenes/{ordenId}/detalles/{detalleId}`

Elimina el detalle indicado de la orden y devuelve al stock del artículo la cantidad que tenía reservada. Devuelve `204 No Content`. Si la orden o el detalle no existen, o el detalle no pertenece a esa orden, devuelve `404 Not Found`.
