package com.questify.api.repository;

import com.questify.api.model.Painting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaintingRepository extends JpaRepository<Painting, Long> {

    @Query("SELECT p FROM Painting p LEFT JOIN FETCH p.hints WHERE p.paintingId = :paintingId")
    Optional<Painting> findByIdWithHints(@Param("paintingId") Long paintingId);
}