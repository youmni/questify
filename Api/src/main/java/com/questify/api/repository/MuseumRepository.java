package com.questify.api.repository;

import com.questify.api.model.Museum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MuseumRepository extends JpaRepository<Museum, Long> {
    List<Museum> findByIsActiveTrue();

    @Query("SELECT DISTINCT m FROM Museum m LEFT JOIN FETCH m.routes")
    List<Museum> findAllWithRoutes();

    @Query("SELECT DISTINCT m FROM Museum m LEFT JOIN FETCH m.routes WHERE m.isActive = true")
    List<Museum> findActiveWithRoutes();

    @Query("SELECT m FROM Museum m LEFT JOIN FETCH m.routes WHERE m.museumId = :museumId")
    Optional<Museum> findByIdWithRoutes(Long museumId);

    @Query("""
           SELECT DISTINCT m
           FROM Museum m
           LEFT JOIN FETCH m.routes r
           LEFT JOIN FETCH r.stops s
           LEFT JOIN FETCH s.painting
           WHERE m.museumId = :museumId
           """)
    Optional<Museum> findByIdWithRoutesStopsAndPaintings(Long museumId);
}