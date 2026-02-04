package com.questify.api.controller;

import com.questify.api.annotations.AllowAuthenticated;
import com.questify.api.dto.response.RouteProgressDTO;
import com.questify.api.model.User;
import com.questify.api.services.implementation.RouteProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class RouteProgressController {

    private final RouteProgressService progressService;

    /**
     * GET /api/progress
     * Get all route progress for current user
     */
    @AllowAuthenticated
    @GetMapping
    public ResponseEntity<List<RouteProgressDTO>> getUserProgress(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(progressService.getUserProgress(user.getId()));
    }

    /**
     * POST /api/progress/routes/{routeId}
     * Start or resume a route
     * Returns current progress state
     */
    @AllowAuthenticated
    @PostMapping("/routes/{routeId}")
    public ResponseEntity<RouteProgressDTO> startOrResumeRoute(
            @PathVariable Long routeId,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(progressService.getOrCreateProgress(user.getId(), routeId));
    }

    /**
     * GET /api/progress/routes/{routeId}
     * Get progress for specific route
     */
    @AllowAuthenticated
    @GetMapping("/routes/{routeId}")
    public ResponseEntity<RouteProgressDTO> getRouteProgress(
            @PathVariable Long routeId,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(progressService.getOrCreateProgress(user.getId(), routeId));
    }
}