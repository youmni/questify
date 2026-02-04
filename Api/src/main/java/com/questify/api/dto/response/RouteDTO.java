package com.questify.api.dto.response;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteDTO {
    private Long routeId;
    private Long museumId;
    private String name;
    private String description;
    private boolean isActive;
    private Integer totalStops;
    private List<RouteStopDTO> stops;
}