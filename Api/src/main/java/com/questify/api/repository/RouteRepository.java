package com.questify.api.repository;

import com.questify.api.model.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {

    List<Route> findByMuseumMuseumIdAndIsActiveTrue(Long museumId);

    @Query("SELECT r FROM Route r LEFT JOIN FETCH r.stops WHERE r.routeId = :routeId")
    Optional<Route> findByIdWithStops(@Param("routeId") Long routeId);
}