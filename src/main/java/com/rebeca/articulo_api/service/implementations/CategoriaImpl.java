package com.rebeca.articulo_api.service.implementations;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rebeca.articulo_api.model.Categoria;
import com.rebeca.articulo_api.repository.CategoriaRepository;
import com.rebeca.articulo_api.service.CategoriaService;
import com.rebeca.articulo_api.utils.exceptions.CategoriaNoEncontradaException;

@Service 
public class CategoriaImpl implements CategoriaService{

    private final CategoriaRepository categoriaRepository;

    @Autowired
    public CategoriaImpl(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    @Override
    public Categoria guardarCategoria(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    @Override
    public Categoria obtenerCategoriaPorId(Long id) {
        return categoriaRepository.findById(id)
            .orElseThrow(() -> new CategoriaNoEncontradaException(id));
    }
        

    @Override
    public Categoria obtenerCategoriaPorNombre(String nombre) {
        return categoriaRepository.findFirstByNombreContainingIgnoreCase(nombre)
            .orElseThrow(() -> new CategoriaNoEncontradaException(nombre));
    }

    @Override
    public List<Categoria> obtenerTodasLasCategorias() {
        return categoriaRepository.findAll();
    }

    @Override
    public Categoria actualizarCategoria(Long id, Categoria categoria) {
        obtenerCategoriaPorId(id);
        Categoria actualizada = new Categoria(id, categoria.getNombre(), categoria.getDescripcion());
        return categoriaRepository.save(actualizada);
    }

    @Override
    public void eliminarCategoria(Long id) {
        obtenerCategoriaPorId(id);
        categoriaRepository.deleteById(id);
    }
    
}
