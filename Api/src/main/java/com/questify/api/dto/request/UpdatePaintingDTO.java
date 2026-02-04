package com.questify.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePaintingDTO {

    @NotBlank(message = "Title is required")
    @Size(max = 300, message = "Title cannot exceed 300 characters")
    private String title;

    @NotBlank(message = "Artist is required")
    @Size(max = 200, message = "Artist cannot exceed 200 characters")
    private String artist;

    private Integer year;

    @Size(max = 100, message = "Museum label cannot exceed 100 characters")
    private String museumLabel;

    @Size(max = 200, message = "Image recognition key cannot exceed 200 characters")
    private String imageRecognitionKey;

    @Size(max = 300, message = "Info title cannot exceed 300 characters")
    private String infoTitle;

    @Size(max = 8000, message = "Info text cannot exceed 8000 characters")
    private String infoText;

    @Size(max = 500, message = "External link cannot exceed 500 characters")
    private String externalLink;
}
