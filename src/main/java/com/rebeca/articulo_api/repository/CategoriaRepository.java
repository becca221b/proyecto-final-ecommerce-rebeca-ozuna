package com.rebeca.articulo_api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rebeca.articulo_api.model.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Long>{
    Optional<Categoria> findByNombre(String nombre);
    Optional<Categoria> findFirstByNombreContainingIgnoreCase(String nombre);
}