package com.rebeca.articulo_api.utils.exceptions;

public class ArticuloNoEncontradoException extends RuntimeException {
    public ArticuloNoEncontradoException(Long id) {
        super("No existe el artículo con ID " + id + ".");
    }
}
