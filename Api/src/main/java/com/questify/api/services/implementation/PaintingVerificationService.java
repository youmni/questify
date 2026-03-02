package com.questify.api.services.implementation;

import com.questify.api.dto.response.ImageVerificationResponseDTO;
import com.questify.api.dto.response.PaintingDetailDTO;
import com.questify.api.dto.response.RouteProgressDTO;
import com.questify.api.model.*;
import com.questify.api.model.enums.WebhookEventType;
import com.questify.api.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaintingVerificationService {

    private final ImageMatchingService imageMatchingService;
    private final MinioStorageService minioStorageService;
    private final MuseumService museumService;
    private final RouteProgressService progressService;
    private final PaintingRepository paintingRepository;
    private final UserPaintingScanRepository scanRepository;
    private final RouteRepository routeRepository;
    private final UserRepository userRepository;
    private final WebhookService webhookService;

    /**
     * Main method: Verify user's photo matches the current painting in their route
     *
     * Flow:
     * 1. Check user is on correct stop
     * 2. Download reference image from MinIO
     * 3. Compare with user's photo using OpenCV
     * 4. If match: record scan, advance progress, return painting details
     * 5. If no match: return failure
     */
    @Transactional
    public ImageVerificationResponseDTO verifyPainting(
            Long userId,
            Long routeId,
            Long paintingId,
            MultipartFile userImage
    ) {

        try {
            // 1. Validate user is on correct painting
            RouteProgressDTO progress = progressService.getOrCreateProgress(userId, routeId);

            if (progress.isCompleted()) {
                return ImageVerificationResponseDTO.builder()
                        .isMatch(false)
                        .confidenceScore(0.0)
                        .message("Route already completed")
                        .build();
            }

            // Check if painting already scanned
            boolean alreadyScanned = scanRepository.existsByUser_IdAndPainting_PaintingIdAndRoute_RouteId(
                    userId, paintingId, routeId
            );

            boolean isCurrentStopPainting = progress.getCurrentPainting() != null
                    && progress.getCurrentPainting().getPaintingId().equals(paintingId);

            // 2. Get painting reference image from MinIO
            Painting painting = paintingRepository.findById(paintingId)
                    .orElseThrow(() -> new RuntimeException("Painting not found"));

            if (painting.getImageRecognitionKey() == null || painting.getImageRecognitionKey().isBlank()) {
                return ImageVerificationResponseDTO.builder()
                        .isMatch(false)
                        .confidenceScore(0.0)
                        .message("Dit schilderij heeft nog geen beeldherkenningssleutel. Neem contact op met de beheerder.")
                        .build();
            }

            String referenceImagePath = "paintings/" + painting.getImageRecognitionKey() + ".jpg";
            String localReferencePath;
            try {
                localReferencePath = minioStorageService.downloadImageToTemp(referenceImagePath);
            } catch (IllegalStateException e) {
                return ImageVerificationResponseDTO.builder()
                        .isMatch(false)
                        .confidenceScore(0.0)
                        .message("Er is nog geen referentieafbeelding beschikbaar voor dit schilderij. " +
                                 "De beheerder moet eerst een afbeelding uploaden via het admin paneel.")
                        .build();
            }

            try {
                // 3. Perform image comparison
                double confidenceScore = imageMatchingService.compareImages(userImage, localReferencePath);
                boolean isMatch = imageMatchingService.isMatchValid(confidenceScore);

                log.info("Image verification - User: {}, Painting: {}, Score: {}, Match: {}",
                        userId, paintingId, confidenceScore, isMatch);

                if (isMatch) {
                    // 4. Return painting details
                    PaintingDetailDTO details = museumService.getPaintingDetails(paintingId);

                    // 5. Record and advance only when this is a new scan on the active stop
                    if (!alreadyScanned && isCurrentStopPainting) {
                        recordSuccessfulScan(userId, routeId, paintingId, confidenceScore);
                        RouteProgressDTO updatedProgress = progressService.advanceToNextStop(userId, routeId);

                        webhookService.fire(WebhookEventType.PAINTING_SCANNED, Map.of(
                                "userId", userId,
                                "routeId", routeId,
                                "paintingId", paintingId,
                                "paintingTitle", painting.getTitle(),
                                "paintingArtist", painting.getArtist(),
                                "confidenceScore", confidenceScore
                        ));

                        if (updatedProgress.isCompleted()) {
                            webhookService.fire(WebhookEventType.ROUTE_COMPLETED, Map.of(
                                    "userId", userId,
                                    "routeId", routeId,
                                    "routeName", updatedProgress.getRouteName(),
                                    "totalStops", updatedProgress.getTotalStops()
                            ));
                        }

                        return ImageVerificationResponseDTO.builder()
                                .isMatch(true)
                                .confidenceScore(confidenceScore)
                                .message("Successfully identified painting!")
                                .paintingDetails(details)
                                .build();
                    }

                    if (alreadyScanned) {
                        return ImageVerificationResponseDTO.builder()
                                .isMatch(true)
                                .confidenceScore(confidenceScore)
                                .message("Dit schilderij heb je al gevonden.")
                                .paintingDetails(details)
                                .build();
                    }

                    return ImageVerificationResponseDTO.builder()
                            .isMatch(true)
                            .confidenceScore(confidenceScore)
                            .message("Correct gescand, maar dit is niet je huidige stop. Je voortgang blijft ongewijzigd.")
                            .paintingDetails(details)
                            .build();

                } else {
                    return ImageVerificationResponseDTO.builder()
                            .isMatch(false)
                            .confidenceScore(confidenceScore)
                            .message("Image does not match the expected painting. Try again!")
                            .build();
                }

            } finally {
                // Cleanup temp file
                minioStorageService.deleteTempFile(localReferencePath);
            }

        } catch (Exception e) {
            log.error("Painting verification failed", e);
            return ImageVerificationResponseDTO.builder()
                    .isMatch(false)
                    .confidenceScore(0.0)
                    .message("Verification error: " + e.getMessage())
                    .build();
        }
    }

    /**
     * Record successful painting scan
     */
    private void recordSuccessfulScan(Long userId, Long routeId, Long paintingId, double confidenceScore) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new RuntimeException("Route not found"));

        Painting painting = paintingRepository.findById(paintingId)
                .orElseThrow(() -> new RuntimeException("Painting not found"));

        UserPaintingScan scan = UserPaintingScan.builder()
                .user(user)
                .route(route)
                .painting(painting)
                .confidenceScore(confidenceScore)
                .build();

        scanRepository.save(scan);

        log.info("Recorded successful scan - User: {}, Painting: {}, Score: {}",
                userId, paintingId, confidenceScore);
    }
}