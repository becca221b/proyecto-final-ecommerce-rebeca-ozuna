package com.rebeca.articulo_api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.rebeca.articulo_api.model.Orden;

public interface OrdenRepository extends JpaRepository<Orden, Long> {
    @Override
    @EntityGraph(attributePaths = {"detalles", "detalles.articulo", "detalles.articulo.categoria"})
    Optional<Orden> findById(Long id);

    @EntityGraph(attributePaths = {"detalles", "detalles.articulo", "detalles.articulo.categoria"})
    @Query("select distinct o from Orden o")
    List<Orden> findAllWithDetails();
}
