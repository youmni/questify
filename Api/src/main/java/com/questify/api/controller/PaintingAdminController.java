package com.questify.api.controller;

import com.questify.api.annotations.AllowAdmin;
import com.questify.api.dto.request.CreatePaintingDTO;
import com.questify.api.dto.request.UpdatePaintingDTO;
import com.questify.api.dto.response.PaintingDetailDTO;
import com.questify.api.services.implementation.PaintingAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/paintings")
@RequiredArgsConstructor
public class PaintingAdminController {

    private final PaintingAdminService paintingAdminService;

    /**
     * GET /api/admin/paintings
     * Get all paintings
     */
    @AllowAdmin
    @GetMapping
    public ResponseEntity<List<PaintingDetailDTO>> getAllPaintings() {
        return ResponseEntity.ok(paintingAdminService.getAllPaintings());
    }

    /**
     * GET /api/admin/paintings/museum/{museumId}
     * Get all paintings for a specific museum
     */
    @AllowAdmin
    @GetMapping("/museum/{museumId}")
    public ResponseEntity<List<PaintingDetailDTO>> getPaintingsByMuseum(@PathVariable Long museumId) {
        return ResponseEntity.ok(paintingAdminService.getPaintingsByMuseum(museumId));
    }

    /**
     * GET /api/admin/paintings/{id}
     * Get single painting by ID
     */
    @AllowAdmin
    @GetMapping("/{id}")
    public ResponseEntity<PaintingDetailDTO> getPaintingById(@PathVariable Long id) {
        return ResponseEntity.ok(paintingAdminService.getPaintingById(id));
    }

    /**
     * POST /api/admin/paintings
     * Create a new painting
     */
    @AllowAdmin
    @PostMapping
    public ResponseEntity<PaintingDetailDTO> createPainting(@Valid @RequestBody CreatePaintingDTO dto) {
        PaintingDetailDTO created = paintingAdminService.createPainting(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * PUT /api/admin/paintings/{id}
     * Update an existing painting
     */
    @AllowAdmin
    @PutMapping("/{id}")
    public ResponseEntity<PaintingDetailDTO> updatePainting(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePaintingDTO dto
    ) {
        return ResponseEntity.ok(paintingAdminService.updatePainting(id, dto));
    }

    /**
     * DELETE /api/admin/paintings/{id}
     * Delete a painting
     */
    @AllowAdmin
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePainting(@PathVariable Long id) {
        paintingAdminService.deletePainting(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * POST /api/admin/paintings/{id}/image
     * Upload a reference image for a painting to MinIO
     */
    @AllowAdmin
    @PostMapping(value = "/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadPaintingImage(
            @PathVariable Long id,
            @RequestParam("image") MultipartFile image
    ) {
        if (image.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No image provided"));
        }
        try {
            String objectName = paintingAdminService.uploadPaintingImage(id, image);
            return ResponseEntity.ok(Map.of("objectName", objectName, "message", "Image uploaded successfully"));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to upload image: " + e.getMessage()));
        }
    }

}
