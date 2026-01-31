package com.questify.api.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PasswordResetDTO {
    @NotBlank(message = "Old Password is required")
    private String oldPassword;

    @Pattern(
            regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$",
            message = "Password must be at least 8 characters, include upper and lower case letters, a number, and a special character"
    )
    private String newPassword;

    @NotBlank(message = "Confirm Password is required")
    private String confirmNewPassword;
}