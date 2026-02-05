package com.questify.api.services.implementation;

import com.questify.api.dto.response.HintDTO;
import com.questify.api.dto.response.MuseumDTO;
import com.questify.api.dto.response.PaintingBasicDTO;
import com.questify.api.dto.response.PaintingDetailDTO;
import com.questify.api.dto.response.RouteDTO;
import com.questify.api.dto.response.RouteStopDTO;
import com.questify.api.model.Hint;
import com.questify.api.model.Museum;
import com.questify.api.model.Painting;
import com.questify.api.model.Route;
import com.questify.api.model.RouteStop;
import com.questify.api.model.enums.HintType;
import com.questify.api.repository.MuseumRepository;
import com.questify.api.repository.PaintingRepository;
import com.questify.api.repository.RouteRepository;
import com.questify.api.repository.RouteStopRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MuseumService {

    private final MuseumRepository museumRepository;
    private final RouteRepository routeRepository;
    private final PaintingRepository paintingRepository;

    private final RouteStopRepository routeStopRepository;

    /**
     * Get all active museums with their routes
     */
    public List<MuseumDTO> getAllActiveMuseums() {
        List<Museum> museums = museumRepository.findActiveWithRoutes();

        List<Long> routeIds = museums.stream()
                .flatMap(m -> (m.getRoutes() == null ? List.<Route>of() : m.getRoutes()).stream())
                .map(Route::getRouteId)
                .distinct()
                .toList();

        Map<Long, List<RouteStopDTO>> stopsByRouteId = routeIds.isEmpty()
                ? Map.of()
                : routeStopRepository.findAllByRouteIdsWithRouteAndPainting(routeIds).stream()
                .collect(Collectors.groupingBy(
                        rs -> rs.getRoute().getRouteId(),
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                list -> list.stream()
                                        .sorted(Comparator.comparing(RouteStop::getSequenceNumber))
                                        .map(this::mapRouteStopToDTO)
                                        .toList()
                        )
                ));

        return museums.stream()
                .map(m -> mapToDTODetail(m, stopsByRouteId))
                .toList();
    }

    /**
     * Get single museum by ID with routes + stops (+ painting basic)
     */
    public MuseumDTO getMuseumById(Long museumId) {
        Museum museum = museumRepository.findByIdWithRoutes(museumId)
                .orElseThrow(() -> new RuntimeException("Museum not found"));

        List<Long> routeIds = (museum.getRoutes() == null ? List.<Route>of() : museum.getRoutes()).stream()
                .map(Route::getRouteId)
                .distinct()
                .toList();

        Map<Long, List<RouteStopDTO>> stopsByRouteId = routeIds.isEmpty()
                ? Map.of()
                : routeStopRepository.findAllByRouteIdsWithRouteAndPainting(routeIds).stream()
                .collect(Collectors.groupingBy(
                        rs -> rs.getRoute().getRouteId(),
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                list -> list.stream()
                                        .sorted(Comparator.comparing(RouteStop::getSequenceNumber))
                                        .map(this::mapRouteStopToDTO)
                                        .toList()
                        )
                ));

        return mapToDTODetail(museum, stopsByRouteId);
    }

    /**
     * Get route details with all stops and paintings
     */
    public RouteDTO getRouteDetails(Long routeId) {
        Route route = routeRepository.findByIdWithStops(routeId)
                .orElseThrow(() -> new RuntimeException("Route not found"));

        return mapRouteToDetailDTO(route);
    }

    /**
     * Get painting details with hints
     */
    public PaintingDetailDTO getPaintingDetails(Long paintingId) {
        Painting painting = paintingRepository.findByIdWithHints(paintingId)
                .orElseThrow(() -> new RuntimeException("Painting not found"));

        return mapToPaintingDetailDTO(painting);
    }

    // =============== MAPPERS ===============

    /**
     * Overview mapper (used for listing museums)
     * routes are basic: stops empty (not null)
     */
    private MuseumDTO mapToDTOOverview(Museum museum) {
        List<RouteDTO> routes =
                (museum.getRoutes() == null ? List.<Route>of() : museum.getRoutes()).stream()
                        .filter(Route::isActive)
                        .map(this::mapRouteToBasicDTO)
                        .collect(Collectors.toList());

        return MuseumDTO.builder()
                .museumId(museum.getMuseumId())
                .name(museum.getName())
                .address(museum.getAddress())
                .description(museum.getDescription())
                .isActive(museum.isActive())
                .routes(routes)
                .build();
    }

    /**
     * Detail mapper (used for getMuseumById)
     * routes include stops (+ painting basic) via stopsByRouteId
     */
    private MuseumDTO mapToDTODetail(Museum museum, Map<Long, List<RouteStopDTO>> stopsByRouteId) {
        List<RouteDTO> routes =
                (museum.getRoutes() == null ? List.<Route>of() : museum.getRoutes()).stream()
                        .map(route -> {
                            List<RouteStopDTO> stops = stopsByRouteId.getOrDefault(route.getRouteId(), List.of());

                            return RouteDTO.builder()
                                    .routeId(route.getRouteId())
                                    .museumId(museum.getMuseumId())
                                    .name(route.getName())
                                    .description(route.getDescription())
                                    .isActive(route.isActive())
                                    .totalStops(stops.size())
                                    .stops(stops)
                                    .build();
                        })
                        .collect(Collectors.toList());

        return MuseumDTO.builder()
                .museumId(museum.getMuseumId())
                .name(museum.getName())
                .address(museum.getAddress())
                .description(museum.getDescription())
                .isActive(museum.isActive())
                .routes(routes)
                .build();
    }

    /**
     * Basic route DTO (no stops, but never null)
     */
    private RouteDTO mapRouteToBasicDTO(Route route) {
        return RouteDTO.builder()
                .routeId(route.getRouteId())
                .museumId(route.getMuseum() != null ? route.getMuseum().getMuseumId() : null)
                .name(route.getName())
                .description(route.getDescription())
                .isActive(route.isActive())
                .totalStops(route.getStops() == null ? 0 : route.getStops().size())
                .stops(List.of())
                .build();
    }

    /**
     * Route details endpoint mapper (also includes stops)
     */
    private RouteDTO mapRouteToDetailDTO(Route route) {
        List<RouteStopDTO> stops =
                (route.getStops() == null ? List.<RouteStop>of() : route.getStops()).stream()
                        .sorted(Comparator.comparing(RouteStop::getSequenceNumber))
                        .map(this::mapRouteStopToDTO)
                        .collect(Collectors.toList());

        return RouteDTO.builder()
                .routeId(route.getRouteId())
                .museumId(route.getMuseum() != null ? route.getMuseum().getMuseumId() : null)
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
                .routeId(stop.getRoute() != null ? stop.getRoute().getRouteId() : null)
                .sequenceNumber(stop.getSequenceNumber())
                .paintingId(stop.getPainting() != null ? stop.getPainting().getPaintingId() : null)
                .painting(stop.getPainting() == null ? null : mapToPaintingBasicDTO(stop.getPainting()))
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

        List<Hint> hints = painting.getHints() == null ? List.of() : painting.getHints();

        List<Hint> standardHints = hints.stream()
                .filter(h -> h.getHintType() == HintType.STANDARD)
                .sorted(Comparator.comparing(Hint::getDisplayOrder))
                .toList();

        List<Hint> extraHints = hints.stream()
                .filter(h -> h.getHintType() == HintType.EXTRA)
                .sorted(Comparator.comparing(Hint::getDisplayOrder))
                .toList();

        return PaintingDetailDTO.builder()
                .paintingId(painting.getPaintingId())
                .museumId(painting.getMuseum() != null ? painting.getMuseum().getMuseumId() : null)
                .title(painting.getTitle())
                .artist(painting.getArtist())
                .year(painting.getYear())
                .museumLabel(painting.getMuseumLabel())
                .imageRecognitionKey(painting.getImageRecognitionKey())
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