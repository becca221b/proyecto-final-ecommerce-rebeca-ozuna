package com.rebeca.articulo_api.dto;

import jakarta.validation.constraints.Positive;

public record PrecioRequest(@Positive double precio) {}
