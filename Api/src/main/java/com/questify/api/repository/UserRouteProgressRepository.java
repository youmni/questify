package com.questify.api.repository;

import com.questify.api.model.UserRouteProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRouteProgressRepository extends JpaRepository<UserRouteProgress, Long> {
    Optional<UserRouteProgress> findByUserIdAndRouteId(Long userId, Long routeId);
    List<UserRouteProgress> findByUserId(Long userId);
    List<UserRouteProgress> findByUserIdAndIsCompleted(Long userId, boolean isCompleted);
}