package com.rebeca.articulo_api.dto;

import jakarta.validation.constraints.PositiveOrZero;

public record CantidadRequest(@PositiveOrZero int cantidad) {}
