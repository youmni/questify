package com.questify.api.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImageVerificationResponseDTO {
    private boolean isMatch;
    private double confidenceScore;
    private String message;
    private PaintingDetailDTO paintingDetails; // Only returned if match = true
}