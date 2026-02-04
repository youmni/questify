package com.questify.api.services.implementation;

import com.questify.api.dto.request.CreateRouteDTO;
import com.questify.api.dto.request.UpdateRouteDTO;
import com.questify.api.dto.response.RouteDTO;
import com.questify.api.dto.response.RouteStopDTO;
import com.questify.api.exceptions.ResourceNotFoundException;
import com.questify.api.model.Museum;
import com.questify.api.model.Route;
import com.questify.api.repository.MuseumRepository;
import com.questify.api.repository.RouteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RouteAdminService {

    private final RouteRepository routeRepository;
    private final MuseumRepository museumRepository;

    @Transactional(readOnly = true)
    public List<RouteDTO> getAllRoutes() {
        return routeRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RouteDTO> getRoutesByMuseum(Long museumId) {
        if (!museumRepository.existsById(museumId)) {
            throw new ResourceNotFoundException("Museum not found with id: " + museumId);
        }
        return routeRepository.findByMuseumMuseumIdAndIsActiveTrue(museumId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RouteDTO getRouteById(Long id) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with id: " + id));
        return convertToDTO(route);
    }

    @Transactional
    public RouteDTO createRoute(CreateRouteDTO dto) {
        Museum museum = museumRepository.findById(dto.getMuseumId())
                .orElseThrow(() -> new ResourceNotFoundException("Museum not found with id: " + dto.getMuseumId()));

        Route route = Route.builder()
                .museum(museum)
                .name(dto.getName())
                .description(dto.getDescription())
                .isActive(dto.isActive())
                .build();

        Route saved = routeRepository.save(route);
        return convertToDTO(saved);
    }

    @Transactional
    public RouteDTO updateRoute(Long id, UpdateRouteDTO dto) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with id: " + id));

        route.setName(dto.getName());
        route.setDescription(dto.getDescription());
        
        if (dto.getIsActive() != null) {
            route.setActive(dto.getIsActive());
        }

        Route updated = routeRepository.save(route);
        return convertToDTO(updated);
    }

    @Transactional
    public void deleteRoute(Long id) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with id: " + id));
        routeRepository.delete(route);
    }

    @Transactional
    public RouteDTO activateRoute(Long id) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with id: " + id));
        route.setActive(true);
        Route updated = routeRepository.save(route);
        return convertToDTO(updated);
    }

    @Transactional
    public RouteDTO deactivateRoute(Long id) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with id: " + id));
        route.setActive(false);
        Route updated = routeRepository.save(route);
        return convertToDTO(updated);
    }

    private RouteDTO convertToDTO(Route route) {
        List<RouteStopDTO> stops = route.getStops().stream()
                .map(this::convertStopToDTO)
                .collect(Collectors.toList());

        return RouteDTO.builder()
                .routeId(route.getRouteId())
                .museumId(route.getMuseum().getMuseumId())
                .name(route.getName())
                .description(route.getDescription())
                .isActive(route.isActive())
                .totalStops(stops.size())
                .stops(stops)
                .build();
    }

    private RouteStopDTO convertStopToDTO(com.questify.api.model.RouteStop stop) {
        return RouteStopDTO.builder()
                .routeStopId(stop.getRouteStopId())
                .routeId(stop.getRoute().getRouteId())
                .paintingId(stop.getPainting().getPaintingId())
                .sequenceNumber(stop.getSequenceNumber())
                .painting(com.questify.api.dto.response.PaintingBasicDTO.builder()
                        .paintingId(stop.getPainting().getPaintingId())
                        .title(stop.getPainting().getTitle())
                        .artist(stop.getPainting().getArtist())
                        .year(stop.getPainting().getYear())
                        .museumLabel(stop.getPainting().getMuseumLabel())
                        .build())
                .build();
    }
}
