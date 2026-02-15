package com.questify.api.repository;

import com.questify.api.model.Hint;
import com.questify.api.model.enums.HintType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HintRepository extends JpaRepository<Hint, Long> {

    long countByPainting_PaintingIdAndHintType(Long paintingId, HintType hintType);

    List<Hint> findByPainting_PaintingIdAndHintTypeOrderByDisplayOrderAsc(Long paintingId, HintType hintType);
}
