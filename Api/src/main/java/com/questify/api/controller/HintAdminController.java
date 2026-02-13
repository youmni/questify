package com.questify.api.controller;

import com.questify.api.annotations.AllowAdmin;
import com.questify.api.dto.request.CreateHintDTO;
import com.questify.api.dto.request.UpdateHintDTO;
import com.questify.api.dto.response.HintDTO;
import com.questify.api.model.enums.HintType;
import com.questify.api.services.implementation.HintAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class HintAdminController {

    private final HintAdminService hintAdminService;

    // GET hints per painting + type
    @AllowAdmin
    @GetMapping("/paintings/{paintingId}/hints")
    public ResponseEntity<List<HintDTO>> getHints(
            @PathVariable Long paintingId,
            @RequestParam HintType type
    ) {
        return ResponseEntity.ok(hintAdminService.getHintsForPainting(paintingId, type));
    }

    // CREATE hint
    @AllowAdmin
    @PostMapping("/paintings/{paintingId}/hints")
    public ResponseEntity<HintDTO> createHint(
            @PathVariable Long paintingId,
            @Valid @RequestBody CreateHintDTO dto
    ) {
        HintDTO created = hintAdminService.createHint(paintingId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // UPDATE hint
    @AllowAdmin
    @PutMapping("/hints/{hintId}")
    public ResponseEntity<HintDTO> updateHint(
            @PathVariable Long hintId,
            @Valid @RequestBody UpdateHintDTO dto
    ) {
        return ResponseEntity.ok(hintAdminService.updateHint(hintId, dto));
    }

    // DELETE hint
    @AllowAdmin
    @DeleteMapping("/hints/{hintId}")
    public ResponseEntity<Void> deleteHint(@PathVariable Long hintId) {
        hintAdminService.deleteHint(hintId);
        return ResponseEntity.noContent().build();
    }
}