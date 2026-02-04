package com.questify.api.repository;

import com.questify.api.model.RouteStop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RouteStopRepository extends JpaRepository<RouteStop, Long> {
    
    List<RouteStop> findByRouteRouteIdOrderBySequenceNumberAsc(Long routeId);
    
    Optional<RouteStop> findByRouteRouteIdAndPaintingPaintingId(Long routeId, Long paintingId);
    
    Optional<RouteStop> findByRouteRouteIdAndSequenceNumber(Long routeId, Integer sequenceNumber);
    
    @Query("SELECT MAX(rs.sequenceNumber) FROM RouteStop rs WHERE rs.route.routeId = :routeId")
    Optional<Integer> findMaxSequenceNumberByRouteId(@Param("routeId") Long routeId);
}
