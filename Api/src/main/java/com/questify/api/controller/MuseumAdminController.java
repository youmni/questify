package com.questify.api.controller;

import com.questify.api.annotations.AllowAdmin;
import com.questify.api.dto.request.CreateMuseumDTO;
import com.questify.api.dto.request.UpdateMuseumDTO;
import com.questify.api.dto.response.MuseumDTO;
import com.questify.api.services.implementation.MuseumAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/museums")
@RequiredArgsConstructor
public class MuseumAdminController {

    private final MuseumAdminService museumAdminService;

    /**
     * GET /api/admin/museums
     * Get all museums (including inactive)
     */
    @AllowAdmin
    @GetMapping
    public ResponseEntity<List<MuseumDTO>> getAllMuseums() {
        return ResponseEntity.ok(museumAdminService.getAllMuseums());
    }

    /**
     * GET /api/admin/museums/{id}
     * Get single museum by ID
     */
    @AllowAdmin
    @GetMapping("/{id}")
    public ResponseEntity<MuseumDTO> getMuseumById(@PathVariable Long id) {
        return ResponseEntity.ok(museumAdminService.getMuseumById(id));
    }

    /**
     * POST /api/admin/museums
     * Create a new museum
     */
    @AllowAdmin
    @PostMapping
    public ResponseEntity<MuseumDTO> createMuseum(@Valid @RequestBody CreateMuseumDTO dto) {
        MuseumDTO created = museumAdminService.createMuseum(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * PUT /api/admin/museums/{id}
     * Update an existing museum
     */
    @AllowAdmin
    @PutMapping("/{id}")
    public ResponseEntity<MuseumDTO> updateMuseum(
            @PathVariable Long id,
            @Valid @RequestBody UpdateMuseumDTO dto
    ) {
        return ResponseEntity.ok(museumAdminService.updateMuseum(id, dto));
    }

    /**
     * DELETE /api/admin/museums/{id}
     * Delete a museum (and all associated routes, paintings, etc.)
     */
    @AllowAdmin
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMuseum(@PathVariable Long id) {
        museumAdminService.deleteMuseum(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * POST /api/admin/museums/{id}/activate
     * Activate a museum
     */
    @AllowAdmin
    @PostMapping("/{id}/activate")
    public ResponseEntity<MuseumDTO> activateMuseum(@PathVariable Long id) {
        return ResponseEntity.ok(museumAdminService.activateMuseum(id));
    }

    /**
     * POST /api/admin/museums/{id}/deactivate
     * Deactivate a museum
     */
    @AllowAdmin
    @PostMapping("/{id}/deactivate")
    public ResponseEntity<MuseumDTO> deactivateMuseum(@PathVariable Long id) {
        return ResponseEntity.ok(museumAdminService.deactivateMuseum(id));
    }
}
