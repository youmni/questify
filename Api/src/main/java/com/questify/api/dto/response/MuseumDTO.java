package com.questify.api.dto.response;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MuseumDTO {
    private Long museumId;
    private String name;
    private String address;
    private String description;
    private boolean isActive;
    private List<RouteDTO> routes;
}