package com.questify.api.repository;

import com.questify.api.model.Museum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MuseumRepository extends JpaRepository<Museum, Long> {
    List<Museum> findByIsActiveTrue();
}