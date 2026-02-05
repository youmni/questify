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

    @Query("""
           SELECT rs
           FROM RouteStop rs
           LEFT JOIN FETCH rs.painting
           WHERE rs.route.routeId = :routeId
           ORDER BY rs.sequenceNumber ASC
           """)
    List<RouteStop> findByRouteIdOrderBySequenceNumberAscWithPainting(@Param("routeId") Long routeId);

    Optional<RouteStop> findByRouteRouteIdAndPaintingPaintingId(Long routeId, Long paintingId);
    
    Optional<RouteStop> findByRouteRouteIdAndSequenceNumber(Long routeId, Integer sequenceNumber);
    
    @Query("SELECT MAX(rs.sequenceNumber) FROM RouteStop rs WHERE rs.route.routeId = :routeId")
    Optional<Integer> findMaxSequenceNumberByRouteId(@Param("routeId") Long routeId);

    @Query("""
           SELECT rs
           FROM RouteStop rs
           JOIN FETCH rs.route r
           LEFT JOIN FETCH rs.painting p
           WHERE r.routeId IN :routeIds
           """)
    List<RouteStop> findAllByRouteIdsWithRouteAndPainting(@Param("routeIds") List<Long> routeIds);
}
