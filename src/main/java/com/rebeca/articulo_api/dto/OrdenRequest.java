package com.rebeca.articulo_api.dto;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

public record OrdenRequest(
    @NotEmpty List<@Valid DetalleOrdenRequest> detalles,
    LocalDate fecha
) {}
