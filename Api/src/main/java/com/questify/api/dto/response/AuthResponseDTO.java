package com.questify.api.dto.response;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthResponseDTO {
    private boolean success;
    private String message;
    private String accessToken;
    private String refreshToken;
}