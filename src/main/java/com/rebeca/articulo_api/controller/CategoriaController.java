package com.rebeca.articulo_api.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rebeca.articulo_api.dto.CategoriaRequest;
import com.rebeca.articulo_api.model.Categoria;
import com.rebeca.articulo_api.service.CategoriaService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {
    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @GetMapping
    public List<Categoria> obtenerTodas() {
        return categoriaService.obtenerTodasLasCategorias();
    }

    @GetMapping("/{id}")
    public Categoria obtenerPorId(@PathVariable Long id) {
        return categoriaService.obtenerCategoriaPorId(id);
    }

    @GetMapping("/buscar")
    public Categoria buscarPorNombre(@RequestParam String nombre) {
        return categoriaService.obtenerCategoriaPorNombre(nombre);
    }

    @PostMapping
    public ResponseEntity<Categoria> crear(@Valid @RequestBody CategoriaRequest request) {
        Categoria categoria = new Categoria(null, request.nombre(), request.descripcion());
        return ResponseEntity.status(HttpStatus.CREATED).body(categoriaService.guardarCategoria(categoria));
    }

    @PutMapping("/{id}")
    public Categoria actualizar(
            @PathVariable Long id,
            @Valid @RequestBody CategoriaRequest request) {
        Categoria categoria = new Categoria(null, request.nombre(), request.descripcion());
        return categoriaService.actualizarCategoria(id, categoria);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        categoriaService.eliminarCategoria(id);
        return ResponseEntity.noContent().build();
    }
}
