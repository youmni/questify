package com.questify.api.dto.response;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaintingDetailDTO {
    private Long paintingId;
    private Long museumId;
    private String title;
    private String artist;
    private Integer year;
    private String museumLabel;
    private String imageRecognitionKey;
    private String infoTitle;
    private String infoText;
    private String externalLink;
    private List<HintDTO> standardHints;
    private List<HintDTO> extraHints;
}