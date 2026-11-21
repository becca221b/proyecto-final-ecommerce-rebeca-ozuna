package com.rebeca.articulo_api.utils.exceptions;

public class DetalleOrdenNoEncontradoException extends RuntimeException {
    public DetalleOrdenNoEncontradoException(Long id) {
        super("No existe el detalle de orden con ID " + id + ".");
    }
}
