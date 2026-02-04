package com.questify.api.controller;

import com.questify.api.annotations.AllowAdmin;
import com.questify.api.dto.request.CreateRouteDTO;
import com.questify.api.dto.request.UpdateRouteDTO;
import com.questify.api.dto.response.RouteDTO;
import com.questify.api.services.implementation.RouteAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/routes")
@RequiredArgsConstructor
public class RouteAdminController {

    private final RouteAdminService routeAdminService;

    /**
     * GET /api/admin/routes
     * Get all routes (including inactive)
     */
    @AllowAdmin
    @GetMapping
    public ResponseEntity<List<RouteDTO>> getAllRoutes() {
        return ResponseEntity.ok(routeAdminService.getAllRoutes());
    }

    /**
     * GET /api/admin/routes/museum/{museumId}
     * Get all routes for a specific museum
     */
    @AllowAdmin
    @GetMapping("/museum/{museumId}")
    public ResponseEntity<List<RouteDTO>> getRoutesByMuseum(@PathVariable Long museumId) {
        return ResponseEntity.ok(routeAdminService.getRoutesByMuseum(museumId));
    }

    /**
     * GET /api/admin/routes/{id}
     * Get single route by ID
     */
    @AllowAdmin
    @GetMapping("/{id}")
    public ResponseEntity<RouteDTO> getRouteById(@PathVariable Long id) {
        return ResponseEntity.ok(routeAdminService.getRouteById(id));
    }

    /**
     * POST /api/admin/routes
     * Create a new route
     */
    @AllowAdmin
    @PostMapping
    public ResponseEntity<RouteDTO> createRoute(@Valid @RequestBody CreateRouteDTO dto) {
        RouteDTO created = routeAdminService.createRoute(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * PUT /api/admin/routes/{id}
     * Update an existing route
     */
    @AllowAdmin
    @PutMapping("/{id}")
    public ResponseEntity<RouteDTO> updateRoute(
            @PathVariable Long id,
            @Valid @RequestBody UpdateRouteDTO dto
    ) {
        return ResponseEntity.ok(routeAdminService.updateRoute(id, dto));
    }

    /**
     * DELETE /api/admin/routes/{id}
     * Delete a route (and all associated route stops)
     */
    @AllowAdmin
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoute(@PathVariable Long id) {
        routeAdminService.deleteRoute(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * POST /api/admin/routes/{id}/activate
     * Activate a route
     */
    @AllowAdmin
    @PostMapping("/{id}/activate")
    public ResponseEntity<RouteDTO> activateRoute(@PathVariable Long id) {
        return ResponseEntity.ok(routeAdminService.activateRoute(id));
    }

    /**
     * POST /api/admin/routes/{id}/deactivate
     * Deactivate a route
     */
    @AllowAdmin
    @PostMapping("/{id}/deactivate")
    public ResponseEntity<RouteDTO> deactivateRoute(@PathVariable Long id) {
        return ResponseEntity.ok(routeAdminService.deactivateRoute(id));
    }
}
