package com.questify.api.services.implementation;

import com.questify.api.dto.request.AddRouteStopDTO;
import com.questify.api.dto.response.RouteStopDTO;
import com.questify.api.exceptions.ResourceNotFoundException;
import com.questify.api.model.Painting;
import com.questify.api.model.Route;
import com.questify.api.model.RouteStop;
import com.questify.api.repository.PaintingRepository;
import com.questify.api.repository.RouteRepository;
import com.questify.api.repository.RouteStopRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RouteStopAdminService {

    private final RouteStopRepository routeStopRepository;
    private final RouteRepository routeRepository;
    private final PaintingRepository paintingRepository;

    @Transactional(readOnly = true)
    public List<RouteStopDTO> getRouteStops(Long routeId) {
        if (!routeRepository.existsById(routeId)) {
            throw new ResourceNotFoundException("Route not found with id: " + routeId);
        }
        
        return routeStopRepository.findByRouteRouteIdOrderBySequenceNumberAsc(routeId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public RouteStopDTO addStopToRoute(Long routeId, AddRouteStopDTO dto) {
        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with id: " + routeId));

        Painting painting = paintingRepository.findById(dto.getPaintingId())
                .orElseThrow(() -> new ResourceNotFoundException("Painting not found with id: " + dto.getPaintingId()));

        // Verify painting belongs to same museum as route
        if (!painting.getMuseum().getMuseumId().equals(route.getMuseum().getMuseumId())) {
            throw new IllegalArgumentException("Painting must belong to the same museum as the route");
        }

        // Check if painting already exists in this route
        routeStopRepository.findByRouteRouteIdAndPaintingPaintingId(routeId, dto.getPaintingId())
                .ifPresent(stop -> {
                    throw new IllegalArgumentException("Painting already exists in this route");
                });

        // Check if sequence number already exists
        routeStopRepository.findByRouteRouteIdAndSequenceNumber(routeId, dto.getSequenceNumber())
                .ifPresent(stop -> {
                    throw new IllegalArgumentException("Sequence number already exists in this route");
                });

        RouteStop routeStop = RouteStop.builder()
                .route(route)
                .painting(painting)
                .sequenceNumber(dto.getSequenceNumber())
                .build();

        RouteStop saved = routeStopRepository.save(routeStop);
        return convertToDTO(saved);
    }

    @Transactional
    public void removeStopFromRoute(Long routeStopId) {
        RouteStop routeStop = routeStopRepository.findById(routeStopId)
                .orElseThrow(() -> new ResourceNotFoundException("Route stop not found with id: " + routeStopId));
        routeStopRepository.delete(routeStop);
    }

    @Transactional
    public RouteStopDTO updateStopSequence(Long routeStopId, Integer newSequenceNumber) {
        RouteStop routeStop = routeStopRepository.findById(routeStopId)
                .orElseThrow(() -> new ResourceNotFoundException("Route stop not found with id: " + routeStopId));

        // Check if new sequence number already exists in this route
        routeStopRepository.findByRouteRouteIdAndSequenceNumber(
                routeStop.getRoute().getRouteId(), 
                newSequenceNumber
        ).ifPresent(stop -> {
            if (!stop.getRouteStopId().equals(routeStopId)) {
                throw new IllegalArgumentException("Sequence number already exists in this route");
            }
        });

        routeStop.setSequenceNumber(newSequenceNumber);
        RouteStop updated = routeStopRepository.save(routeStop);
        return convertToDTO(updated);
    }

    @Transactional
    public List<RouteStopDTO> reorderStops(Long routeId, List<Long> orderedRouteStopIds) {
        // Verify route exists
        if (!routeRepository.existsById(routeId)) {
            throw new ResourceNotFoundException("Route not found with id: " + routeId);
        }

        List<RouteStop> stops = routeStopRepository.findByRouteRouteIdOrderBySequenceNumberAsc(routeId);

        // Verify all provided IDs exist in the route
        if (stops.size() != orderedRouteStopIds.size()) {
            throw new IllegalArgumentException("Number of provided stop IDs does not match route stops count");
        }

        // Update sequence numbers
        for (int i = 0; i < orderedRouteStopIds.size(); i++) {
            Long stopId = orderedRouteStopIds.get(i);
            RouteStop stop = stops.stream()
                    .filter(s -> s.getRouteStopId().equals(stopId))
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("Route stop not found with id: " + stopId));
            
            stop.setSequenceNumber(i + 1);
        }

        routeStopRepository.saveAll(stops);

        return routeStopRepository.findByRouteRouteIdOrderBySequenceNumberAsc(routeId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private RouteStopDTO convertToDTO(RouteStop routeStop) {
        return RouteStopDTO.builder()
                .routeStopId(routeStop.getRouteStopId())
                .routeId(routeStop.getRoute().getRouteId())
                .paintingId(routeStop.getPainting().getPaintingId())
                .sequenceNumber(routeStop.getSequenceNumber())
                .build();
    }
}
