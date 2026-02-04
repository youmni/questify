package com.questify.api.services.implementation;

import com.questify.api.dto.response.*;
import com.questify.api.model.*;
import com.questify.api.model.enums.HintType;
import com.questify.api.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MuseumService {

    private final MuseumRepository museumRepository;
    private final RouteRepository routeRepository;
    private final PaintingRepository paintingRepository;

    /**
     * Get all active museums with their routes
     * Optimized: Single query per museum with routes
     */
    public List<MuseumDTO> getAllActiveMuseums() {
        return museumRepository.findByIsActiveTrue().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get single museum by ID with all routes and stops
     */
    public MuseumDTO getMuseumById(Long museumId) {
        Museum museum = museumRepository.findById(museumId)
                .orElseThrow(() -> new RuntimeException("Museum not found"));

        return mapToDTO(museum);
    }

    /**
     * Get route details with all stops and paintings
     * This is the main endpoint for starting a route
     */
    public RouteDTO getRouteDetails(Long routeId) {
        Route route = routeRepository.findByIdWithStops(routeId)
                .orElseThrow(() -> new RuntimeException("Route not found"));

        return mapRouteToDetailDTO(route);
    }

    /**
     * Get painting details with hints
     * Called when user successfully scans a painting
     */
    public PaintingDetailDTO getPaintingDetails(Long paintingId) {
        Painting painting = paintingRepository.findByIdWithHints(paintingId)
                .orElseThrow(() -> new RuntimeException("Painting not found"));

        return mapToPaintingDetailDTO(painting);
    }

    // =============== MAPPERS ===============

    private MuseumDTO mapToDTO(Museum museum) {
        return MuseumDTO.builder()
                .museumId(museum.getMuseumId())
                .name(museum.getName())
                .address(museum.getAddress())
                .description(museum.getDescription())
                .isActive(museum.isActive())
                .routes(museum.getRoutes().stream()
                        .filter(Route::isActive)
                        .map(this::mapRouteToBasicDTO)
                        .collect(Collectors.toList()))
                .build();
    }

    private RouteDTO mapRouteToBasicDTO(Route route) {
        return RouteDTO.builder()
                .routeId(route.getRouteId())
                .name(route.getName())
                .description(route.getDescription())
                .isActive(route.isActive())
                .totalStops(route.getStops().size())
                .build();
    }

    private RouteDTO mapRouteToDetailDTO(Route route) {
        List<RouteStopDTO> stops = route.getStops().stream()
                .sorted((a, b) -> a.getSequenceNumber().compareTo(b.getSequenceNumber()))
                .map(this::mapRouteStopToDTO)
                .collect(Collectors.toList());

        return RouteDTO.builder()
                .routeId(route.getRouteId())
                .name(route.getName())
                .description(route.getDescription())
                .isActive(route.isActive())
                .totalStops(stops.size())
                .stops(stops)
                .build();
    }

    private RouteStopDTO mapRouteStopToDTO(RouteStop stop) {
        return RouteStopDTO.builder()
                .routeStopId(stop.getRouteStopId())
                .sequenceNumber(stop.getSequenceNumber())
                .painting(mapToPaintingBasicDTO(stop.getPainting()))
                .build();
    }

    private PaintingBasicDTO mapToPaintingBasicDTO(Painting painting) {
        return PaintingBasicDTO.builder()
                .paintingId(painting.getPaintingId())
                .title(painting.getTitle())
                .artist(painting.getArtist())
                .year(painting.getYear())
                .museumLabel(painting.getMuseumLabel())
                .build();
    }

    private PaintingDetailDTO mapToPaintingDetailDTO(Painting painting) {

        List<Hint> standardHints = painting.getHints().stream()
                .filter(h -> h.getHintType() == HintType.STANDARD)
                .sorted((a, b) -> a.getDisplayOrder().compareTo(b.getDisplayOrder()))
                .toList();

        List<Hint> extraHints = painting.getHints().stream()
                .filter(h -> h.getHintType() == HintType.EXTRA)
                .sorted((a, b) -> a.getDisplayOrder().compareTo(b.getDisplayOrder()))
                .toList();

        return PaintingDetailDTO.builder()
                .paintingId(painting.getPaintingId())
                .title(painting.getTitle())
                .artist(painting.getArtist())
                .year(painting.getYear())
                .museumLabel(painting.getMuseumLabel())
                .infoTitle(painting.getInfoTitle())
                .infoText(painting.getInfoText())
                .externalLink(painting.getExternalLink())
                .standardHints(standardHints.stream().map(this::mapHintToDTO).collect(Collectors.toList()))
                .extraHints(extraHints.stream().map(this::mapHintToDTO).collect(Collectors.toList()))
                .build();
    }

    private HintDTO mapHintToDTO(Hint hint) {
        return HintDTO.builder()
                .hintId(hint.getHintId())
                .text(hint.getText())
                .displayOrder(hint.getDisplayOrder())
                .build();
    }
}