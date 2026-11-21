package com.rebeca.articulo_api.service;

import java.util.List;
import java.time.LocalDate;

import com.rebeca.articulo_api.model.Orden;
import com.rebeca.articulo_api.utils.exceptions.StockInsuficienteException;

public interface OrdenService {
    Orden guardarOrden(List<ItemOrden> items, LocalDate fecha) throws StockInsuficienteException;
    Orden obtenerOrdenPorId(Long id);
    List<Orden> obtenerTodasLasOrdenes();
    Orden actualizarOrden(Long id, List<ItemOrden> items, LocalDate fecha) throws StockInsuficienteException;
}
