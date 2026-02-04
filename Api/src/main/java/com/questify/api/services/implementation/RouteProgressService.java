package com.questify.api.services.implementation;

import com.questify.api.dto.response.*;
import com.questify.api.model.*;
import com.questify.api.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class RouteProgressService {

    private final UserRouteProgressRepository progressRepository;
    private final UserPaintingScanRepository scanRepository;
    private final RouteRepository routeRepository;
    private final UserRepository userRepository;
    private final MuseumService museumService;

    /**
     * Get or create user's progress for a route
     * Called when user starts a route
     */
    @Transactional
    public RouteProgressDTO getOrCreateProgress(Long userId, Long routeId) {

        Optional<UserRouteProgress> existing = progressRepository.findByUserIdAndRouteId(userId, routeId);

        if (existing.isPresent()) {
            return buildProgressDTO(existing.get());
        }

        // Create new progress
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Route route = routeRepository.findByIdWithStops(routeId)
                .orElseThrow(() -> new RuntimeException("Route not found"));

        UserRouteProgress progress = UserRouteProgress.builder()
                .user(user)
                .route(route)
                .currentStopNumber(1)
                .isCompleted(false)
                .build();

        progress = progressRepository.save(progress);

        log.info("Created new route progress for user {} on route {}", userId, routeId);

        return buildProgressDTO(progress);
    }

    /**
     * Advance user to next stop after successful scan
     */
    @Transactional
    public RouteProgressDTO advanceToNextStop(Long userId, Long routeId) {

        UserRouteProgress progress = progressRepository.findByUserIdAndRouteId(userId, routeId)
                .orElseThrow(() -> new RuntimeException("Progress not found"));

        Route route = routeRepository.findByIdWithStops(routeId)
                .orElseThrow(() -> new RuntimeException("Route not found"));

        int totalStops = route.getStops().size();
        int currentStop = progress.getCurrentStopNumber();

        if (currentStop >= totalStops) {
            // Route completed
            progress.setCompleted(true);
            progress.setCompletedAt(LocalDateTime.now());
            log.info("User {} completed route {}", userId, routeId);
        } else {
            // Move to next stop
            progress.setCurrentStopNumber(currentStop + 1);
            log.info("User {} advanced to stop {} on route {}", userId, currentStop + 1, routeId);
        }

        progress = progressRepository.save(progress);

        return buildProgressDTO(progress);
    }

    /**
     * Get all user's route progress
     */
    @Transactional(readOnly = true)
    public List<RouteProgressDTO> getUserProgress(Long userId) {
        return progressRepository.findByUserId(userId).stream()
                .map(this::buildProgressDTO)
                .toList();
    }

    /**
     * Build comprehensive progress DTO
     */
    private RouteProgressDTO buildProgressDTO(UserRouteProgress progress) {

        Route route = routeRepository.findByIdWithStops(progress.getRoute().getRouteId())
                .orElseThrow(() -> new RuntimeException("Route not found"));

        List<RouteStop> stops = route.getStops().stream()
                .sorted((a, b) -> a.getSequenceNumber().compareTo(b.getSequenceNumber()))
                .toList();

        int totalStops = stops.size();
        int currentStopNumber = progress.getCurrentStopNumber();

        // Get completed paintings
        List<Long> completedPaintingIds = scanRepository.findCompletedPaintingIdsByUserAndRoute(
                progress.getUser().getId(),
                route.getRouteId()
        );

        // Current painting
        PaintingBasicDTO currentPainting = null;
        PaintingBasicDTO nextPainting = null;

        if (!progress.isCompleted() && currentStopNumber <= totalStops) {
            RouteStop currentStop = stops.get(currentStopNumber - 1);
            currentPainting = mapToPaintingBasicDTO(currentStop.getPainting());

            // Next painting (if exists)
            if (currentStopNumber < totalStops) {
                RouteStop nextStop = stops.get(currentStopNumber);
                nextPainting = mapToPaintingBasicDTO(nextStop.getPainting());
            }
        }

        return RouteProgressDTO.builder()
                .routeId(route.getRouteId())
                .routeName(route.getName())
                .totalStops(totalStops)
                .completedStops(completedPaintingIds.size())
                .currentStopNumber(currentStopNumber)
                .currentPainting(currentPainting)
                .nextPainting(nextPainting)
                .completedPaintingIds(completedPaintingIds)
                .isCompleted(progress.isCompleted())
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
}