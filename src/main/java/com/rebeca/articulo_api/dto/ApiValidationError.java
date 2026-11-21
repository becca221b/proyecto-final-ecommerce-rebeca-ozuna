package com.rebeca.articulo_api.dto;

import java.time.Instant;
import java.util.Map;

public record ApiValidationError(
    Instant timestamp,
    int status,
    String error,
    String path,
    Map<String, String> errors
) {}