package com.rebeca.articulo_api.service;

import java.util.List;
import com.rebeca.articulo_api.model.Categoria;

public interface CategoriaService {
    Categoria guardarCategoria(Categoria categoria);
    Categoria obtenerCategoriaPorId(Long id);
    Categoria obtenerCategoriaPorNombre(String nombre);
    List<Categoria> obtenerTodasLasCategorias();
    Categoria actualizarCategoria(Long id, Categoria categoria);
    void eliminarCategoria(Long id);
}
