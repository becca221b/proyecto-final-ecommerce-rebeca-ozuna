package com.rebeca.articulo_api.dto;

import jakarta.validation.constraints.Positive;

public record ActualizarDetalleOrdenRequest(@Positive int cantidad) {}
