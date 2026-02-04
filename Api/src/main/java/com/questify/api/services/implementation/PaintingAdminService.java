package com.questify.api.services.implementation;

import com.questify.api.dto.request.CreatePaintingDTO;
import com.questify.api.dto.request.UpdatePaintingDTO;
import com.questify.api.dto.response.PaintingDetailDTO;
import com.questify.api.exceptions.ResourceNotFoundException;
import com.questify.api.model.Museum;
import com.questify.api.model.Painting;
import com.questify.api.repository.MuseumRepository;
import com.questify.api.repository.PaintingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaintingAdminService {

    private final PaintingRepository paintingRepository;
    private final MuseumRepository museumRepository;

    @Transactional(readOnly = true)
    public List<PaintingDetailDTO> getAllPaintings() {
        return paintingRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PaintingDetailDTO> getPaintingsByMuseum(Long museumId) {
        Museum museum = museumRepository.findById(museumId)
                .orElseThrow(() -> new ResourceNotFoundException("Museum not found with id: " + museumId));
        
        return museum.getPaintings().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PaintingDetailDTO getPaintingById(Long id) {
        Painting painting = paintingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Painting not found with id: " + id));
        return convertToDTO(painting);
    }

    @Transactional
    public PaintingDetailDTO createPainting(CreatePaintingDTO dto) {
        Museum museum = museumRepository.findById(dto.getMuseumId())
                .orElseThrow(() -> new ResourceNotFoundException("Museum not found with id: " + dto.getMuseumId()));

        Painting painting = Painting.builder()
                .museum(museum)
                .title(dto.getTitle())
                .artist(dto.getArtist())
                .year(dto.getYear())
                .museumLabel(dto.getMuseumLabel())
                .imageRecognitionKey(dto.getImageRecognitionKey())
                .infoTitle(dto.getInfoTitle())
                .infoText(dto.getInfoText())
                .externalLink(dto.getExternalLink())
                .build();

        Painting saved = paintingRepository.save(painting);
        return convertToDTO(saved);
    }

    @Transactional
    public PaintingDetailDTO updatePainting(Long id, UpdatePaintingDTO dto) {
        Painting painting = paintingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Painting not found with id: " + id));

        painting.setTitle(dto.getTitle());
        painting.setArtist(dto.getArtist());
        painting.setYear(dto.getYear());
        painting.setMuseumLabel(dto.getMuseumLabel());
        
        if (dto.getImageRecognitionKey() != null) {
            painting.setImageRecognitionKey(dto.getImageRecognitionKey());
        }
        
        painting.setInfoTitle(dto.getInfoTitle());
        painting.setInfoText(dto.getInfoText());
        painting.setExternalLink(dto.getExternalLink());

        Painting updated = paintingRepository.save(painting);
        return convertToDTO(updated);
    }

    @Transactional
    public void deletePainting(Long id) {
        Painting painting = paintingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Painting not found with id: " + id));
        paintingRepository.delete(painting);
    }

    private PaintingDetailDTO convertToDTO(Painting painting) {
        return PaintingDetailDTO.builder()
                .paintingId(painting.getPaintingId())
                .museumId(painting.getMuseum().getMuseumId())
                .title(painting.getTitle())
                .artist(painting.getArtist())
                .year(painting.getYear())
                .museumLabel(painting.getMuseumLabel())
                .imageRecognitionKey(painting.getImageRecognitionKey())
                .infoTitle(painting.getInfoTitle())
                .infoText(painting.getInfoText())
                .externalLink(painting.getExternalLink())
                .build();
    }
}
