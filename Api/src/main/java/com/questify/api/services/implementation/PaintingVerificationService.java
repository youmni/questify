package com.questify.api.services.implementation;

import com.questify.api.dto.response.ImageVerificationResponseDTO;
import com.questify.api.dto.response.PaintingDetailDTO;
import com.questify.api.dto.response.RouteProgressDTO;
import com.questify.api.model.*;
import com.questify.api.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

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
            boolean alreadyScanned = scanRepository.existsByUserIdAndPaintingIdAndRouteId(
                    userId, paintingId, routeId
            );

            if (alreadyScanned) {
                return ImageVerificationResponseDTO.builder()
                        .isMatch(false)
                        .confidenceScore(0.0)
                        .message("Painting already scanned in this route")
                        .build();
            }

            // Validate this is the current painting in the route
            if (progress.getCurrentPainting() == null ||
                    !progress.getCurrentPainting().getPaintingId().equals(paintingId)) {
                return ImageVerificationResponseDTO.builder()
                        .isMatch(false)
                        .confidenceScore(0.0)
                        .message("This is not the current painting in your route")
                        .build();
            }

            // 2. Get painting reference image from MinIO
            Painting painting = paintingRepository.findById(paintingId)
                    .orElseThrow(() -> new RuntimeException("Painting not found"));

            String referenceImagePath = "paintings/" + painting.getImageRecognitionKey() + ".jpg";
            String localReferencePath = minioStorageService.downloadImageToTemp(referenceImagePath);

            try {
                // 3. Perform image comparison
                double confidenceScore = imageMatchingService.compareImages(userImage, localReferencePath);
                boolean isMatch = imageMatchingService.isMatchValid(confidenceScore);

                log.info("Image verification - User: {}, Painting: {}, Score: {}, Match: {}",
                        userId, paintingId, confidenceScore, isMatch);

                if (isMatch) {
                    // 4. Record successful scan
                    recordSuccessfulScan(userId, routeId, paintingId, confidenceScore);

                    // 5. Advance to next stop
                    progressService.advanceToNextStop(userId, routeId);

                    // 6. Return painting details
                    PaintingDetailDTO details = museumService.getPaintingDetails(paintingId);

                    return ImageVerificationResponseDTO.builder()
                            .isMatch(true)
                            .confidenceScore(confidenceScore)
                            .message("Successfully identified painting!")
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