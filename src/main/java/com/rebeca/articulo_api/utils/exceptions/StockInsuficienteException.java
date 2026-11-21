package com.rebeca.articulo_api.utils.exceptions;

public class StockInsuficienteException extends Exception {
    public StockInsuficienteException(int cantidadSolicitada, int cantidadDisponible) {
        super("Stock insuficiente. Se requiere " + cantidadSolicitada + " unidades, pero solo hay " + cantidadDisponible + " disponibles.");
    }
    
}
