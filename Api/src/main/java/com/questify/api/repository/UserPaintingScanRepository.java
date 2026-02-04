package com.questify.api.repository;

import com.questify.api.model.UserPaintingScan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserPaintingScanRepository extends JpaRepository<UserPaintingScan, Long> {

    // Check if user already scanned this painting in this route
    // Using correct property paths: user.id, painting.paintingId, route.routeId
    boolean existsByUser_IdAndPainting_PaintingIdAndRoute_RouteId(
            Long userId, Long paintingId, Long routeId
    );

    // Get painting IDs that user has scanned in a specific route
    @Query("SELECT ups.painting.paintingId FROM UserPaintingScan ups " +
           "WHERE ups.user.id = :userId AND ups.route.routeId = :routeId")
    List<Long> findCompletedPaintingIdsByUserAndRoute(
            @Param("userId") Long userId, 
            @Param("routeId") Long routeId
    );
}