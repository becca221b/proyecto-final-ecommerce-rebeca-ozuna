package com.rebeca.articulo_api.dto;

import jakarta.validation.constraints.Positive;

public record DetalleOrdenRequest(
    @Positive Long articuloId,
    @Positive int cantidad
) {}
