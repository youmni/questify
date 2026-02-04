package com.questify.api.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HintDTO {
    private Long hintId;
    private String text;
    private Integer displayOrder;
}