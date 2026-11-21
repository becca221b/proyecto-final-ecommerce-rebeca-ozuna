package com.rebeca.articulo_api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.rebeca.articulo_api.dto.ApiError;
import com.rebeca.articulo_api.dto.ApiValidationError;
import com.rebeca.articulo_api.utils.exceptions.ArticuloNoEncontradoException;
import com.rebeca.articulo_api.utils.exceptions.CategoriaNoEncontradaException;
import com.rebeca.articulo_api.utils.exceptions.OrdenNoEncontradaException;
import com.rebeca.articulo_api.utils.exceptions.StockInsuficienteException;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(ArticuloNoEncontradoException.class)
    public ResponseEntity<ApiError> manejarArticuloNoEncontrado(
            ArticuloNoEncontradoException exception,
            HttpServletRequest request) {
        ApiError error = new ApiError(
            Instant.now(),
            HttpStatus.NOT_FOUND.value(),
            HttpStatus.NOT_FOUND.getReasonPhrase(),
            exception.getMessage(),
            request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler({CategoriaNoEncontradaException.class, OrdenNoEncontradaException.class})
    public ResponseEntity<String> manejarRecursoNoEncontrado(RuntimeException exception) {
        return ResponseEntity.notFound().build();
    }

    @ExceptionHandler(StockInsuficienteException.class)
    public ResponseEntity<String> manejarStockInsuficiente(StockInsuficienteException exception) {
        return ResponseEntity.status(409).body(exception.getMessage());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<String> manejarConflictoDeIntegridad(DataIntegrityViolationException exception) {
        return ResponseEntity.status(409).body("No se puede completar la operación por una relación existente.");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiValidationError> manejarErroresValidacion(
        MethodArgumentNotValidException exception,
        HttpServletRequest request
    ) {

            Map<String, String> errores = new HashMap<>();

            exception.getBindingResult()
                    .getFieldErrors()
                    .forEach(error ->
                        errores.put(error.getField(), error.getDefaultMessage())
                    );

            ApiValidationError respuesta = new ApiValidationError(
                Instant.now(),
                HttpStatus.BAD_REQUEST.value(),
                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                request.getRequestURI(),
                errores
            );

            return ResponseEntity.badRequest().body(respuesta);
    }

}
