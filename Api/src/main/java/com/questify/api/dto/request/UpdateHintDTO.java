package com.questify.api.dto.request;

import com.questify.api.model.enums.HintType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateHintDTO {

    @NotNull
    private HintType hintType;

    @NotBlank
    @Size(max = 1000)
    private String text;

    @NotNull
    private Integer displayOrder;
}