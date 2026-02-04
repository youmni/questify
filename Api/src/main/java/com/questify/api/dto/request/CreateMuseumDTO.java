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
public class CreateMuseumDTO {

    @NotBlank(message = "Museum name is required")
    @Size(max = 200, message = "Museum name cannot exceed 200 characters")
    private String name;

    @NotBlank(message = "Address is required")
    @Size(max = 400, message = "Address cannot exceed 400 characters")
    private String address;

    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;

    @Builder.Default
    private boolean isActive = true;
}
