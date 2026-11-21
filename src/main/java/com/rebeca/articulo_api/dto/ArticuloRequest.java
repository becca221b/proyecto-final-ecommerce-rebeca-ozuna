package com.rebeca.articulo_api.dto;

import com.rebeca.articulo_api.model.Categoria;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public record ArticuloRequest(
    @NotBlank String nombre,
    @Positive double precio,
    @PositiveOrZero(message = "La cantidad en stock debe ser un valor positivo o cero") int cantidadStock,
    Categoria categoria
) {}
