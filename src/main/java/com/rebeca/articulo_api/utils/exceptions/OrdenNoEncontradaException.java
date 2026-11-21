package com.rebeca.articulo_api.utils.exceptions;

public class OrdenNoEncontradaException extends RuntimeException {
    public OrdenNoEncontradaException(Long id) {
        super("No existe la orden con ID " + id + ".");
    }
}
