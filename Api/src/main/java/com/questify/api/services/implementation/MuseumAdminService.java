package com.questify.api.services.implementation;

import com.questify.api.dto.request.CreateMuseumDTO;
import com.questify.api.dto.request.UpdateMuseumDTO;
import com.questify.api.dto.response.MuseumDTO;
import com.questify.api.dto.response.RouteDTO;
import com.questify.api.exceptions.ResourceNotFoundException;
import com.questify.api.model.Museum;
import com.questify.api.repository.MuseumRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MuseumAdminService {

    private final MuseumRepository museumRepository;

    @Transactional(readOnly = true)
    public List<MuseumDTO> getAllMuseums() {
        return museumRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MuseumDTO getMuseumById(Long id) {
        Museum museum = museumRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Museum not found with id: " + id));
        return convertToDTO(museum);
    }

    @Transactional
    public MuseumDTO createMuseum(CreateMuseumDTO dto) {
        Museum museum = Museum.builder()
                .name(dto.getName())
                .address(dto.getAddress())
                .description(dto.getDescription())
                .isActive(dto.isActive())
                .build();

        Museum saved = museumRepository.save(museum);
        return convertToDTO(saved);
    }

    @Transactional
    public MuseumDTO updateMuseum(Long id, UpdateMuseumDTO dto) {
        Museum museum = museumRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Museum not found with id: " + id));

        museum.setName(dto.getName());
        museum.setAddress(dto.getAddress());
        museum.setDescription(dto.getDescription());
        
        if (dto.getIsActive() != null) {
            museum.setActive(dto.getIsActive());
        }

        Museum updated = museumRepository.save(museum);
        return convertToDTO(updated);
    }

    @Transactional
    public void deleteMuseum(Long id) {
        Museum museum = museumRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Museum not found with id: " + id));
        museumRepository.delete(museum);
    }

    @Transactional
    public MuseumDTO activateMuseum(Long id) {
        Museum museum = museumRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Museum not found with id: " + id));
        museum.setActive(true);
        Museum updated = museumRepository.save(museum);
        return convertToDTO(updated);
    }

    @Transactional
    public MuseumDTO deactivateMuseum(Long id) {
        Museum museum = museumRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Museum not found with id: " + id));
        museum.setActive(false);
        Museum updated = museumRepository.save(museum);
        return convertToDTO(updated);
    }

    private MuseumDTO convertToDTO(Museum museum) {
        List<RouteDTO> routes = museum.getRoutes().stream()
                .map(route -> RouteDTO.builder()
                        .routeId(route.getRouteId())
                        .name(route.getName())
                        .description(route.getDescription())
                        .isActive(route.isActive())
                        .build())
                .collect(Collectors.toList());

        return MuseumDTO.builder()
                .museumId(museum.getMuseumId())
                .name(museum.getName())
                .address(museum.getAddress())
                .description(museum.getDescription())
                .isActive(museum.isActive())
                .routes(routes)
                .build();
    }
}
