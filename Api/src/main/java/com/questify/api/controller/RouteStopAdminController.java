package com.questify.api.controller;

import com.questify.api.annotations.AllowAdmin;
import com.questify.api.dto.request.AddRouteStopDTO;
import com.questify.api.dto.response.RouteStopDTO;
import com.questify.api.services.implementation.RouteStopAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/route-stops")
@RequiredArgsConstructor
public class RouteStopAdminController {

    private final RouteStopAdminService routeStopAdminService;

    /**
     * GET /api/admin/route-stops/route/{routeId}
     * Get all stops for a specific route in order
     */
    @AllowAdmin
    @GetMapping("/route/{routeId}")
    public ResponseEntity<List<RouteStopDTO>> getRouteStops(@PathVariable Long routeId) {
        return ResponseEntity.ok(routeStopAdminService.getRouteStops(routeId));
    }

    /**
     * POST /api/admin/route-stops/route/{routeId}
     * Add a painting to a route at a specific sequence number
     */
    @AllowAdmin
    @PostMapping("/route/{routeId}")
    public ResponseEntity<RouteStopDTO> addStopToRoute(
            @PathVariable Long routeId,
            @Valid @RequestBody AddRouteStopDTO dto
    ) {
        RouteStopDTO created = routeStopAdminService.addStopToRoute(routeId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * DELETE /api/admin/route-stops/{routeStopId}
     * Remove a stop from a route
     */
    @AllowAdmin
    @DeleteMapping("/{routeStopId}")
    public ResponseEntity<Void> removeStopFromRoute(@PathVariable Long routeStopId) {
        routeStopAdminService.removeStopFromRoute(routeStopId);
        return ResponseEntity.noContent().build();
    }

    /**
     * PATCH /api/admin/route-stops/{routeStopId}/sequence
     * Update the sequence number of a specific stop
     */
    @AllowAdmin
    @PatchMapping("/{routeStopId}/sequence")
    public ResponseEntity<RouteStopDTO> updateStopSequence(
            @PathVariable Long routeStopId,
            @RequestParam Integer sequenceNumber
    ) {
        return ResponseEntity.ok(routeStopAdminService.updateStopSequence(routeStopId, sequenceNumber));
    }

    /**
     * PUT /api/admin/route-stops/route/{routeId}/reorder
     * Reorder all stops in a route by providing ordered list of route stop IDs
     */
    @AllowAdmin
    @PutMapping("/route/{routeId}/reorder")
    public ResponseEntity<List<RouteStopDTO>> reorderStops(
            @PathVariable Long routeId,
            @RequestBody List<Long> orderedRouteStopIds
    ) {
        return ResponseEntity.ok(routeStopAdminService.reorderStops(routeId, orderedRouteStopIds));
    }
}
