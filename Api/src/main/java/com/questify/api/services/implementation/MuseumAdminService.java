package com.questify.api.services.implementation;

import com.questify.api.dto.request.CreateMuseumDTO;
import com.questify.api.dto.request.UpdateMuseumDTO;
import com.questify.api.dto.response.MuseumDTO;
import com.questify.api.dto.response.PaintingBasicDTO;
import com.questify.api.dto.response.RouteDTO;
import com.questify.api.dto.response.RouteStopDTO;
import com.questify.api.exceptions.ResourceNotFoundException;
import com.questify.api.model.Museum;
import com.questify.api.model.Route;
import com.questify.api.model.RouteStop;
import com.questify.api.repository.MuseumRepository;
import com.questify.api.repository.RouteStopRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MuseumAdminService {

    private final MuseumRepository museumRepository;
    private final RouteStopRepository routeStopRepository;

    @Transactional(readOnly = true)
    public List<MuseumDTO> getAllMuseums() {
        List<Museum> museums = museumRepository.findAllWithRoutes();

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
                                        .map(this::mapStopToDTO)
                                        .toList()
                        )
                ));

        return museums.stream()
                .map(m -> convertToDTO(m, stopsByRouteId))
                .toList();
    }

    @Transactional(readOnly = true)
    public MuseumDTO getMuseumById(Long id) {
        Museum museum = museumRepository.findByIdWithRoutes(id)
                .orElseThrow(() -> new ResourceNotFoundException("Museum not found with id: " + id));

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
                                        .map(this::mapStopToDTO)
                                        .toList()
                        )
                ));

        return convertToDTO(museum, stopsByRouteId);
    }

    @Transactional
    public MuseumDTO createMuseum(CreateMuseumDTO dto) {
        Museum museum = Museum.builder()
                .name(dto.getName())
                .address(dto.getAddress())
                .description(dto.getDescription())
                .isActive(dto.isActive())
                .build();

        Museum saved = museumRepository.save(museum);
        return convertToDTO(saved, Map.of());
    }

    @Transactional
    public MuseumDTO updateMuseum(Long id, UpdateMuseumDTO dto) {
        Museum museum = museumRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Museum not found with id: " + id));

        museum.setName(dto.getName());
        museum.setAddress(dto.getAddress());
        museum.setDescription(dto.getDescription());
        
        if (dto.getIsActive() != null) {
            museum.setActive(dto.getIsActive());
        }

        Museum updated = museumRepository.save(museum);
        return convertToDTO(updated, Map.of());
    }

    @Transactional
    public void deleteMuseum(Long id) {
        Museum museum = museumRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Museum not found with id: " + id));
        museumRepository.delete(museum);
    }

    @Transactional
    public MuseumDTO activateMuseum(Long id) {
        Museum museum = museumRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Museum not found with id: " + id));
        museum.setActive(true);
        Museum updated = museumRepository.save(museum);
        return convertToDTO(updated, Map.of());
    }

    @Transactional
    public MuseumDTO deactivateMuseum(Long id) {
        Museum museum = museumRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Museum not found with id: " + id));
        museum.setActive(false);
        Museum updated = museumRepository.save(museum);
        return convertToDTO(updated, Map.of());
    }

    private MuseumDTO convertToDTO(Museum museum, Map<Long, List<RouteStopDTO>> stopsByRouteId) {
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
                        .toList();

        return MuseumDTO.builder()
                .museumId(museum.getMuseumId())
                .name(museum.getName())
                .address(museum.getAddress())
                .description(museum.getDescription())
                .isActive(museum.isActive())
                .routes(routes)
                .build();
    }

    private RouteStopDTO mapStopToDTO(RouteStop stop) {
        return RouteStopDTO.builder()
                .routeStopId(stop.getRouteStopId())
                .routeId(stop.getRoute().getRouteId())
                .paintingId(stop.getPainting() != null ? stop.getPainting().getPaintingId() : null)
                .sequenceNumber(stop.getSequenceNumber())
                .painting(stop.getPainting() == null ? null : PaintingBasicDTO.builder()
                        .paintingId(stop.getPainting().getPaintingId())
                        .title(stop.getPainting().getTitle())
                        .artist(stop.getPainting().getArtist())
                        .year(stop.getPainting().getYear())
                        .museumLabel(stop.getPainting().getMuseumLabel())
                        .build())
                .build();
    }
}
