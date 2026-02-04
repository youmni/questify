package com.questify.api.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddRouteStopDTO {

    @NotNull(message = "Painting ID is required")
    private Long paintingId;

    @NotNull(message = "Sequence number is required")
    private Integer sequenceNumber;
}
