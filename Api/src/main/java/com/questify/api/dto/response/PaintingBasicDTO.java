package com.questify.api.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaintingBasicDTO {
    private Long paintingId;
    private String title;
    private String artist;
    private Integer year;
    private String museumLabel;
}