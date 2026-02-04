package com.questify.api.repository;

import com.questify.api.model.UserRouteProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRouteProgressRepository
        extends JpaRepository<UserRouteProgress, Long> {

    Optional<UserRouteProgress> findByUser_IdAndRoute_RouteId(
            Long userId,
            Long routeId
    );

    List<UserRouteProgress> findByUser_Id(Long userId);

    List<UserRouteProgress> findByUser_IdAndIsCompleted(
            Long userId,
            boolean isCompleted
    );
}
