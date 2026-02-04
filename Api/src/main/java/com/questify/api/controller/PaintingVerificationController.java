package com.questify.api.controller;

import com.questify.api.annotations.AllowAuthenticated;
import com.questify.api.dto.response.ImageVerificationResponseDTO;
import com.questify.api.model.User;
import com.questify.api.services.implementation.PaintingVerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/verify")
@RequiredArgsConstructor
public class PaintingVerificationController {

    private final PaintingVerificationService verificationService;

    /**
     * POST /api/verify/routes/{routeId}/paintings/{paintingId}
     *
     * Main endpoint: User scans a painting
     *
     * Request:
     * - routeId: Current route user is on
     * - paintingId: Painting they're trying to scan
     * - userImage: Photo taken by user
     *
     * Response:
     * - isMatch: true if painting identified
     * - confidenceScore: Match quality (0.0 - 1.0)
     * - message: User-friendly message
     * - paintingDetails: Full painting info (only if match = true)
     *
     * Flow:
     * 1. Validates user is on correct stop in route
     * 2. Compares user image with reference image using OpenCV
     * 3. If match: advances to next stop, returns painting details
     * 4. If no match: returns error message
     */
    @AllowAuthenticated
    @PostMapping(
            value = "/routes/{routeId}/paintings/{paintingId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ImageVerificationResponseDTO> verifyPainting(
            @PathVariable Long routeId,
            @PathVariable Long paintingId,
            @RequestParam("image") MultipartFile userImage,
            @AuthenticationPrincipal User user
    ) {

        // Validate file
        if (userImage.isEmpty()) {
            return ResponseEntity.badRequest().body(
                    ImageVerificationResponseDTO.builder()
                            .isMatch(false)
                            .confidenceScore(0.0)
                            .message("No image provided")
                            .build()
            );
        }

        // Verify image
        ImageVerificationResponseDTO response = verificationService.verifyPainting(
                user.getId(),
                routeId,
                paintingId,
                userImage
        );

        return ResponseEntity.ok(response);
    }
}