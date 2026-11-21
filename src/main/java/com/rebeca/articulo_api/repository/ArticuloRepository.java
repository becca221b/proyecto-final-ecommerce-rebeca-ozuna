package com.rebeca.articulo_api.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rebeca.articulo_api.model.Articulo;
import com.rebeca.articulo_api.model.Categoria;

public interface ArticuloRepository extends JpaRepository<Articulo, Long> {
    Optional<Articulo> findByNombre(String nombre);
    Optional<Articulo> findFirstByNombreContainingIgnoreCase(String nombre);
    List<Articulo> findAllByCategoria(Categoria categoria);
    List<Articulo> findAllByCategoria_Id(Long categoriaId);
}
