package com.rebeca.articulo_api.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "ordenes")
public class Orden {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "orden_id")
    private List<DetalleOrden> detalles = new ArrayList<>();
    private LocalDate fecha;

    public Orden() {}

    public Orden(Long id, List<DetalleOrden> detalles, LocalDate fecha) {
        this.id = id;
        this.detalles = detalles;
        this.fecha = fecha;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public LocalDate getFecha() {
        return fecha;
    }
   

    public List<DetalleOrden> getDetalles() {
        return detalles;
    }

    public void actualizar(List<DetalleOrden> detalles, LocalDate fecha) {
        this.detalles.clear();
        this.detalles.addAll(detalles);
        this.fecha = fecha;
    }

    public double getCostoTotal() {
        return calcularCostoTotal();
    }

    // Ver en qué capa va este método
    public void agregarPedido(DetalleOrden pedido) {
        detalles.add(pedido);
    }

    
    // Ver en qué capa va este método
    // Método para calcular el costo total de la orden
    public double calcularCostoTotal() {
        return detalles.stream()
        .mapToDouble(DetalleOrden::calcularSubtotal)
        .sum();
    }
    
}
