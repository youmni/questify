package com.questify.api.repository;

import com.questify.api.model.UserPaintingScan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserPaintingScanRepository extends JpaRepository<UserPaintingScan, Long> {

    @Query("SELECT ups.painting.paintingId FROM UserPaintingScan ups " +
            "WHERE ups.user.id = :userId AND ups.route.routeId = :routeId")
    List<Long> findCompletedPaintingIdsByUserAndRoute(
            @Param("userId") Long userId,
            @Param("routeId") Long routeId
    );

    boolean existsByUserIdAndPaintingIdAndRouteId(Long userId, Long paintingId, Long routeId);

    List<UserPaintingScan> findByUserIdAndRouteId(Long userId, Long routeId);
}