package com.rebeca.articulo_api.service;

import java.util.List;
import java.util.Optional;

import com.rebeca.articulo_api.model.Articulo;
import com.rebeca.articulo_api.model.Categoria;
import com.rebeca.articulo_api.utils.exceptions.StockInsuficienteException;

public interface ArticuloService {
    Articulo guardarArticulo(Articulo articulo);
    Optional<Articulo> obtenerArticuloPorNombre(String nombre);
    Articulo obtenerArticuloPorId(Long id);
    List <Articulo> obtenerTodosLosArticulos();
    List <Articulo> obtenerArticulosPorCategoria(Categoria categoria);
    List<Articulo> obtenerArticulosPorCategoriaId(Long categoriaId);
    Articulo actualizarArticulo(Long id, Articulo articulo);
    boolean eliminarArticulo(Long id);
    boolean cambiarPrecio(Long id, double nuevoPrecio);
    boolean ingresarStock(Long id, int cantidad);
    boolean restarStock(Long id, int cantidad) throws StockInsuficienteException;
}
