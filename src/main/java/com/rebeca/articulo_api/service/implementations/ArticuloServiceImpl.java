package com.rebeca.articulo_api.service.implementations;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rebeca.articulo_api.model.Articulo;
import com.rebeca.articulo_api.model.Categoria;
import com.rebeca.articulo_api.repository.ArticuloRepository;
import com.rebeca.articulo_api.service.ArticuloService;
import com.rebeca.articulo_api.utils.exceptions.ArticuloNoEncontradoException;
import com.rebeca.articulo_api.utils.exceptions.StockInsuficienteException;


@Service
public class ArticuloServiceImpl implements ArticuloService {

    private final ArticuloRepository articuloRepository;

    @Autowired
    public ArticuloServiceImpl(ArticuloRepository articuloRepository) {
        this.articuloRepository = articuloRepository;
    }
    
    @Override
    public Articulo guardarArticulo(Articulo articulo) {
        return articuloRepository.save(articulo);
    }

    @Override
    public Articulo obtenerArticuloPorId(Long id) {
        return articuloRepository.findById(id)
            .orElseThrow(() -> new ArticuloNoEncontradoException(id));
    }

    @Override
    public List<Articulo> obtenerTodosLosArticulos() {
        return articuloRepository.findAll();
    }

    @Override
    public Articulo actualizarArticulo(Long id, Articulo articulo) {
        obtenerArticuloPorId(id);
        Articulo actualizado = new Articulo(
            id,
            articulo.getNombre(),
            articulo.getPrecio(),
            articulo.getCategoria(),
            articulo.getCantidadStock()
        );
        return articuloRepository.save(actualizado);
    }

    @Override
    public boolean eliminarArticulo(Long id) {
        if(!articuloRepository.existsById(id)){
            throw new ArticuloNoEncontradoException(id);
        }
        articuloRepository.deleteById(id);
        return true;
    }

    @Override
    public Optional<Articulo> obtenerArticuloPorNombre(String nombre) {
        return articuloRepository.findFirstByNombreContainingIgnoreCase(nombre);
    }

    @Override
    public List<Articulo> obtenerArticulosPorCategoria(Categoria categoria) {
        return articuloRepository.findAllByCategoria(categoria);
    }

    @Override
    public List<Articulo> obtenerArticulosPorCategoriaId(Long categoriaId) {
        return articuloRepository.findAllByCategoria_Id(categoriaId);
    }
    


    @Override
    public boolean cambiarPrecio(Long id, double nuevoPrecio) {
        Articulo articulo = obtenerArticuloPorId(id);
        articulo.cambiarPrecio(nuevoPrecio);
        articuloRepository.save(articulo);
        return true;
    }

    @Override
    public boolean ingresarStock(Long id, int cantidad) {
        Articulo articulo = obtenerArticuloPorId(id);
        articulo.ingresarStock(cantidad);
        articuloRepository.save(articulo);
        return true;
    }

    @Override
    public boolean restarStock(Long id, int cantidad) throws StockInsuficienteException{
        Articulo articulo = obtenerArticuloPorId(id);
        articulo.restarStock(cantidad);
        articuloRepository.save(articulo);
        return true;
    }
    
}
