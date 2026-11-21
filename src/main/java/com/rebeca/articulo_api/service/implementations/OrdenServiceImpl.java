package com.rebeca.articulo_api.service.implementations;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rebeca.articulo_api.model.Articulo;
import com.rebeca.articulo_api.model.DetalleOrden;
import com.rebeca.articulo_api.model.Orden;
import com.rebeca.articulo_api.repository.ArticuloRepository;
import com.rebeca.articulo_api.repository.OrdenRepository;
import com.rebeca.articulo_api.service.ItemOrden;
import com.rebeca.articulo_api.service.OrdenService;
import com.rebeca.articulo_api.utils.exceptions.ArticuloNoEncontradoException;
import com.rebeca.articulo_api.utils.exceptions.DetalleOrdenNoEncontradoException;
import com.rebeca.articulo_api.utils.exceptions.OrdenNoEncontradaException;
import com.rebeca.articulo_api.utils.exceptions.StockInsuficienteException;

@Service
public class OrdenServiceImpl implements OrdenService {
    private final OrdenRepository ordenRepository;
    private final ArticuloRepository articuloRepository;

    public OrdenServiceImpl(OrdenRepository ordenRepository, ArticuloRepository articuloRepository) {
        this.ordenRepository = ordenRepository;
        this.articuloRepository = articuloRepository;
    }

    @Override
    @Transactional(rollbackFor = StockInsuficienteException.class)
    public Orden guardarOrden(List<ItemOrden> items, LocalDate fecha) throws StockInsuficienteException {
        List<DetalleOrden> detalles = crearDetallesYDescontarStock(items);
        Orden orden = new Orden(null, detalles, fecha == null ? LocalDate.now() : fecha);
        return ordenRepository.save(orden);
    }

    @Override
    @Transactional(readOnly = true)
    public Orden obtenerOrdenPorId(Long id) {
        return ordenRepository.findById(id)
            .orElseThrow(() -> new OrdenNoEncontradaException(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Orden> obtenerTodasLasOrdenes() {
        return ordenRepository.findAllWithDetails();
    }

    @Override
    @Transactional(rollbackFor = StockInsuficienteException.class)
    public Orden actualizarOrden(Long id, List<ItemOrden> items, LocalDate fecha)
            throws StockInsuficienteException {
        Orden orden = obtenerOrdenPorId(id);
        devolverStock(orden.getDetalles());
        List<DetalleOrden> nuevosDetalles = crearDetallesYDescontarStock(items);
        orden.actualizar(nuevosDetalles, fecha == null ? orden.getFecha() : fecha);
        return ordenRepository.save(orden);
    }

    @Override
    @Transactional(rollbackFor = StockInsuficienteException.class)
    public Orden actualizarDetalleOrden(Long ordenId, Long detalleId, int cantidad)
            throws StockInsuficienteException {
        Orden orden = obtenerOrdenPorId(ordenId);
        DetalleOrden detalle = obtenerDetalleOrden(orden, detalleId);
        int diferencia = cantidad - detalle.getCantidad();
        Articulo articulo = detalle.getArticulo();

        if (diferencia > 0) {
            articulo.restarStock(diferencia);
            articuloRepository.save(articulo);
        } else if (diferencia < 0) {
            articulo.ingresarStock(-diferencia);
            articuloRepository.save(articulo);
        }

        detalle.actualizarCantidad(cantidad);
        return ordenRepository.save(orden);
    }

    @Override
    @Transactional
    public void eliminarDetalleOrden(Long ordenId, Long detalleId) {
        Orden orden = obtenerOrdenPorId(ordenId);
        DetalleOrden detalle = obtenerDetalleOrden(orden, detalleId);
        Articulo articulo = detalle.getArticulo();

        articulo.ingresarStock(detalle.getCantidad());
        articuloRepository.save(articulo);
        orden.getDetalles().remove(detalle);
        ordenRepository.save(orden);
    }

    private DetalleOrden obtenerDetalleOrden(Orden orden, Long detalleId) {
        return orden.getDetalles().stream()
            .filter(detalle -> detalleId.equals(detalle.getId()))
            .findFirst()
            .orElseThrow(() -> new DetalleOrdenNoEncontradoException(detalleId));
    }

    private List<DetalleOrden> crearDetallesYDescontarStock(List<ItemOrden> items)
            throws StockInsuficienteException {
        List<DetalleOrden> detalles = new ArrayList<>();
        for (ItemOrden item : items) {
            Articulo articulo = obtenerArticulo(item.articuloId());
            articulo.restarStock(item.cantidad());
            articuloRepository.save(articulo);
            detalles.add(new DetalleOrden(articulo, item.cantidad()));
        }
        return detalles;
    }

    private void devolverStock(List<DetalleOrden> detalles) {
        for (DetalleOrden detalle : detalles) {
            Articulo articulo = obtenerArticulo(detalle.getArticulo().getId());
            articulo.ingresarStock(detalle.getCantidad());
            articuloRepository.save(articulo);
        }
    }

    private Articulo obtenerArticulo(Long id) {
        return articuloRepository.findById(id)
            .orElseThrow(() -> new ArticuloNoEncontradoException(id));
    }
}
