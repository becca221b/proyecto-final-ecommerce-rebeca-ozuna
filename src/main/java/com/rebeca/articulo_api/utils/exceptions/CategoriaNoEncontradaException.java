package com.rebeca.articulo_api.utils.exceptions;

public class CategoriaNoEncontradaException extends RuntimeException {
    public CategoriaNoEncontradaException(Long id) {
        super("No existe la categoría con ID " + id + ".");
    }

    public CategoriaNoEncontradaException(String nombre) {
        super("No se encontró una categoría cuyo nombre contenga \"" + nombre + "\".");
    }
}
