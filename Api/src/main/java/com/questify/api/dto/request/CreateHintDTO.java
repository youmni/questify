package com.questify.api.dto.request;

import com.questify.api.model.enums.HintType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateHintDTO {

    @NotBlank
    private String text;

    @NotNull
    private HintType hintType;

    /**
     * Optional. If null, the backend will append this hint
     * after existing hints of the same type for the painting.
     */
    private Integer displayOrder;
}
