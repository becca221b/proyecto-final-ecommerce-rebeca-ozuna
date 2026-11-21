package com.rebeca.articulo_api.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rebeca.articulo_api.dto.DetalleOrdenRequest;
import com.rebeca.articulo_api.dto.OrdenRequest;
import com.rebeca.articulo_api.model.Orden;
import com.rebeca.articulo_api.service.ItemOrden;
import com.rebeca.articulo_api.service.OrdenService;
import com.rebeca.articulo_api.utils.exceptions.StockInsuficienteException;

import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/ordenes")
public class OrdenController {
    private final OrdenService ordenService;

    public OrdenController(OrdenService ordenService) {
        this.ordenService = ordenService;
    }

    @GetMapping
    public List<Orden> obtenerTodas() {
        return ordenService.obtenerTodasLasOrdenes();
    }

    @GetMapping("/{id}")
    public Orden obtenerPorId(@PathVariable Long id) {
        return ordenService.obtenerOrdenPorId(id);
    }

    @PostMapping
    public ResponseEntity<Orden> crear(@Valid @RequestBody OrdenRequest request)
            throws StockInsuficienteException {
        Orden orden = ordenService.guardarOrden(convertirItems(request.detalles()), request.fecha());
        return ResponseEntity.status(HttpStatus.CREATED).body(orden);
    }

    @PutMapping("/{id}")
    public Orden actualizar(
            @PathVariable Long id,
            @Valid @RequestBody OrdenRequest request) throws StockInsuficienteException {
        return ordenService.actualizarOrden(id, convertirItems(request.detalles()), request.fecha());
    }

    private List<ItemOrden> convertirItems(List<DetalleOrdenRequest> detalles) {
        return detalles.stream()
            .map(detalle -> new ItemOrden(detalle.articuloId(), detalle.cantidad()))
            .toList();
    }
}
