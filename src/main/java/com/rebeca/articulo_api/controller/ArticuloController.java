package com.rebeca.articulo_api.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rebeca.articulo_api.dto.ArticuloRequest;
import com.rebeca.articulo_api.dto.CantidadRequest;
import com.rebeca.articulo_api.dto.PrecioRequest;
import com.rebeca.articulo_api.model.Articulo;
import com.rebeca.articulo_api.service.ArticuloService;
import com.rebeca.articulo_api.utils.exceptions.StockInsuficienteException;

import jakarta.validation.Valid;



@CrossOrigin(origins = "*")
@RestController 
@RequestMapping ("/api/articulos")
public class ArticuloController {
    @Autowired 
    private ArticuloService articuloService;


    @GetMapping
    public List<Articulo> getArticulos(){
        return articuloService.obtenerTodosLosArticulos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Articulo> getById(@PathVariable Long id){
        return ResponseEntity.ok(articuloService.obtenerArticuloPorId(id));
    }

    @GetMapping("/buscar")
    public ResponseEntity<Articulo> buscarPorNombre(@RequestParam String nombre) {
        return articuloService.obtenerArticuloPorNombre(nombre)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/categoria/{categoriaId}")
    public List<Articulo> obtenerPorCategoria(@PathVariable Long categoriaId) {
        return articuloService.obtenerArticulosPorCategoriaId(categoriaId);
    }

    @PostMapping
    public Articulo creArticulo(@Valid @RequestBody ArticuloRequest request){
        Articulo articulo = new Articulo(
            null,
            request.nombre(),
            request.precio(),
            request.categoria(),
            request.cantidadStock()
        );
        return articuloService.guardarArticulo(articulo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Articulo> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ArticuloRequest request) {
        Articulo articulo = new Articulo(
            null,
            request.nombre(),
            request.precio(),
            request.categoria(),
            request.cantidadStock()
        );
        return ResponseEntity.ok(articuloService.actualizarArticulo(id, articulo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        articuloService.eliminarArticulo(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/precio")
    public ResponseEntity<Map<String, String>> cambiarPrecio(
            @PathVariable Long id,
            @Valid @RequestBody PrecioRequest request) {
        articuloService.cambiarPrecio(id, request.precio());
        return ResponseEntity.ok(Map.of("mensaje", "El precio del artículo fue actualizado correctamente", "precio: ", request.toString()));
    }

    @PatchMapping("/{id}/stock/ingresar")
    public ResponseEntity<Void> ingresarStock(
            @PathVariable Long id,
            @Valid @RequestBody CantidadRequest request) {
        articuloService.ingresarStock(id, request.cantidad());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/stock/restar")
    public ResponseEntity<Void> restarStock(
            @PathVariable Long id,
            @Valid @RequestBody CantidadRequest request) throws StockInsuficienteException {
        articuloService.restarStock(id, request.cantidad());
        return ResponseEntity.noContent().build();
    }
}
