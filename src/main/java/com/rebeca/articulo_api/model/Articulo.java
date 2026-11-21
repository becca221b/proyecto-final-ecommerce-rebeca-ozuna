package com.rebeca.articulo_api.model;

import com.rebeca.articulo_api.utils.exceptions.StockInsuficienteException;
import com.rebeca.articulo_api.utils.Validaciones;

import jakarta.persistence.*;

@Entity
@Table(name = "articulos")
public class Articulo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private double precio;
    private int cantidadStock;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_categoria")
    private Categoria categoria;

    public Articulo() {}

    public Articulo(Long id, String nombre, double precio, Categoria categoria, int cantidadStock) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.cantidadStock = cantidadStock;
    }

    public Long getId() {
        return id;
    }

   
    public String getNombre() {
        return nombre;
    }

    public double getPrecio() {
        return precio;
    }

    
    public void cambiarPrecio(double nuevoPrecio) {
        if (!Validaciones.validarPositivo(nuevoPrecio)) {
            throw new IllegalArgumentException("El precio debe ser mayor a cero.");
        }
        this.precio = nuevoPrecio;
    }

    public int getCantidadStock() {
        return cantidadStock;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void restarStock(int cantidad) throws StockInsuficienteException {
        if (!Validaciones.validarNoNegativo(cantidad)) {
            throw new IllegalArgumentException("La cantidad de stock no puede ser negativa.");
        }
        if (cantidad > cantidadStock) {
            throw new StockInsuficienteException(cantidad, cantidadStock);
        }
        this.cantidadStock -= cantidad;
    }

   
    public void ingresarStock(int cantidad) {
        if (!Validaciones.validarNoNegativo(cantidad)) {
            throw new IllegalArgumentException("La cantidad de stock no puede ser negativa.");
        }
        this.cantidadStock += cantidad;
    }

    @Override
    public String toString() {
        return "Articulo {" +
                "id=" + id +
                ", nombre='" + nombre + '\'' +
                ", precio=" + precio +
                ", cantidadStock=" + cantidadStock +
                ", categoria=" + categoria +
                "}";
    }
}

