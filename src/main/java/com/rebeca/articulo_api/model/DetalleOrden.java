package com.rebeca.articulo_api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "detalles_ordenes")
public class DetalleOrden {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "articulo_id")
    private Articulo articulo;
    private int cantidad;

 
    // Constructor
    public DetalleOrden() {}

    public DetalleOrden(Articulo articulo, int cantidad) {
        if (cantidad <= 0) {
            throw new IllegalArgumentException("La cantidad debe ser mayor a cero.");
        }
        this.articulo = articulo;
        this.cantidad = cantidad;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public Articulo getArticulo() {
        return articulo;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void actualizarCantidad(int cantidad) {
        if (cantidad <= 0) {
            throw new IllegalArgumentException("La cantidad debe ser mayor a cero.");
        }
        this.cantidad = cantidad;
    }

    // Ver en qué capa va este método
    public double calcularSubtotal() {
        return articulo.getPrecio() * cantidad;
    }
}
