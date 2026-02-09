package com.questify.api.controller;

import com.questify.api.annotations.AllowAuthenticated;
import com.questify.api.dto.response.*;
import com.questify.api.services.implementation.MuseumService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/museums")
@RequiredArgsConstructor
public class MuseumController {

    private final MuseumService museumService;

    /**
     * GET /api/museums
     * Get all active museums with their routes
     */
    @AllowAuthenticated
    @GetMapping
    public ResponseEntity<List<MuseumDTO>> getAllMuseums() {
        return ResponseEntity.ok(museumService.getAllActiveMuseums());
    }

    /**
     * GET /api/museums/{id}
     * Get single museum details
     */
    @AllowAuthenticated
    @GetMapping("/{id}")
    public ResponseEntity<MuseumDTO> getMuseumById(@PathVariable Long id) {
        return ResponseEntity.ok(museumService.getMuseumById(id));
    }

    /**
     * GET /api/museums/{museumId}/routes/{routeId}
     * Get route details with all stops
     * Called when user selects a route to start
     */
    @AllowAuthenticated
    @GetMapping("/{museumId}/routes/{routeId}")
    public ResponseEntity<RouteDTO> getRouteDetails(
            @PathVariable Long museumId,
            @PathVariable Long routeId
    ) {
        return ResponseEntity.ok(museumService.getRouteDetails(routeId));
    }

    /**
     * GET /api/museums/paintings/{paintingId}
     * Get painting details including hints for authenticated users.
     */
    @AllowAuthenticated
    @GetMapping("/paintings/{paintingId}")
    public ResponseEntity<PaintingDetailDTO> getPaintingDetails(@PathVariable Long paintingId) {
        return ResponseEntity.ok(museumService.getPaintingDetails(paintingId));
    }
}