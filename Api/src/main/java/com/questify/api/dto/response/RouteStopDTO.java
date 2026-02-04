package com.questify.api.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteStopDTO {
    private Long routeStopId;
    private Integer sequenceNumber;
    private PaintingBasicDTO painting;
}