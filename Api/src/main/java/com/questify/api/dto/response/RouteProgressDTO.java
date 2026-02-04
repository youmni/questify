package com.questify.api.dto.response;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteProgressDTO {
    private Long routeId;
    private String routeName;
    private Integer totalStops;
    private Integer completedStops;
    private Integer currentStopNumber;
    private PaintingBasicDTO currentPainting;
    private PaintingBasicDTO nextPainting;
    private List<Long> completedPaintingIds;
    private boolean isCompleted;
}