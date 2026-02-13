package com.questify.api.services.implementation;

import com.questify.api.dto.request.CreateHintDTO;
import com.questify.api.dto.request.UpdateHintDTO;
import com.questify.api.dto.response.HintDTO;
import com.questify.api.exceptions.ResourceNotFoundException;
import com.questify.api.model.Hint;
import com.questify.api.model.Painting;
import com.questify.api.model.enums.HintType;
import com.questify.api.repository.HintRepository;
import com.questify.api.repository.PaintingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HintAdminService {

    private final HintRepository hintRepository;
    private final PaintingRepository paintingRepository;

    @Transactional(readOnly = true)
    public List<HintDTO> getHintsForPainting(Long paintingId, HintType type) {
        return hintRepository
                .findByPainting_PaintingIdAndHintTypeOrderByDisplayOrderAsc(paintingId, type)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional
    public HintDTO createHint(Long paintingId, CreateHintDTO dto) {
        Painting painting = paintingRepository.findByIdWithHints(paintingId)
                .orElseThrow(() -> new ResourceNotFoundException("Painting not found with id: " + paintingId));

        int newOrder = computeInsertOrder(painting, dto.getHintType(), dto.getDisplayOrder());

        // shift bestaande hints vanaf newOrder
        shiftUp(painting, dto.getHintType(), newOrder);

        Hint hint = Hint.builder()
                .painting(painting)
                .hintType(dto.getHintType())
                .text(dto.getText())
                .displayOrder(newOrder)
                .build();

        try {
            Hint saved = hintRepository.save(hint);
            return toDTO(saved);
        } catch (DataIntegrityViolationException ex) {
            // safety net: mocht er toch een collision zijn
            throw new RuntimeException("Hint order conflict for painting/type. Try another displayOrder.", ex);
        }
    }

    @Transactional
    public HintDTO updateHint(Long hintId, UpdateHintDTO dto) {
        Hint hint = hintRepository.findById(hintId)
                .orElseThrow(() -> new ResourceNotFoundException("Hint not found with id: " + hintId));

        Painting painting = paintingRepository.findByIdWithHints(hint.getPainting().getPaintingId())
                .orElseThrow(() -> new ResourceNotFoundException("Painting not found"));

        HintType oldType = hint.getHintType();
        int oldOrder = hint.getDisplayOrder();

        HintType newType = dto.getHintType();
        int newOrder = dto.getDisplayOrder();

        // als type/order wijzigt: eerst “gat dichten” en dan opnieuw shiften
        if (oldType != newType || oldOrder != newOrder) {
            // gat dichten in oude reeks
            shiftDown(painting, oldType, oldOrder);

            // in nieuwe reeks plaats maken
            shiftUp(painting, newType, newOrder);
        }

        hint.setHintType(newType);
        hint.setDisplayOrder(newOrder);
        hint.setText(dto.getText());

        try {
            return toDTO(hintRepository.save(hint));
        } catch (DataIntegrityViolationException ex) {
            throw new RuntimeException("Hint order conflict for painting/type. Try another displayOrder.", ex);
        }
    }

    @Transactional
    public void deleteHint(Long hintId) {
        Hint hint = hintRepository.findById(hintId)
                .orElseThrow(() -> new ResourceNotFoundException("Hint not found with id: " + hintId));

        Long paintingId = hint.getPainting().getPaintingId();
        HintType type = hint.getHintType();
        int order = hint.getDisplayOrder();

        hintRepository.delete(hint);

        Painting painting = paintingRepository.findByIdWithHints(paintingId)
                .orElseThrow(() -> new ResourceNotFoundException("Painting not found"));

        // gat dichten
        shiftDown(painting, type, order);
    }

    private int computeInsertOrder(Painting painting, HintType type, Integer requested) {
        int size = (int) painting.getHints().stream().filter(h -> h.getHintType() == type).count();
        if (requested == null) return size + 1;              // achteraan
        if (requested < 1) return 1;
        if (requested > size + 1) return size + 1;
        return requested;
    }

    // verhoog displayOrder van alle hints >= fromOrder
    private void shiftUp(Painting painting, HintType type, int fromOrder) {
        painting.getHints().stream()
                .filter(h -> h.getHintType() == type)
                .filter(h -> h.getDisplayOrder() >= fromOrder)
                .forEach(h -> h.setDisplayOrder(h.getDisplayOrder() + 1));
        // door @Transactional + managed entities wordt dit gepersist
    }

    // verlaag displayOrder van alle hints > deletedOrder
    private void shiftDown(Painting painting, HintType type, int deletedOrder) {
        painting.getHints().stream()
                .filter(h -> h.getHintType() == type)
                .filter(h -> h.getDisplayOrder() > deletedOrder)
                .forEach(h -> h.setDisplayOrder(h.getDisplayOrder() - 1));
    }

    private HintDTO toDTO(Hint hint) {
        return HintDTO.builder()
                .hintId(hint.getHintId())
                .text(hint.getText())
                .displayOrder(hint.getDisplayOrder())
                .build();
    }
}