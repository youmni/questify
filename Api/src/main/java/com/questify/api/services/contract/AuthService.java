package com.questify.api.services.contract;

import com.questify.api.dto.request.*;
import com.questify.api.dto.response.AuthResponseDTO;
import com.questify.api.dto.response.UserDTO;
import jakarta.servlet.http.HttpServletRequest;

public interface AuthService {
    UserDTO register(RegistrationDTO registrationDTO);
    void resetPassword(Long id, PasswordResetDTO passwordResetDTO);
    AuthResponseDTO login(LoginDTO loginDTO);
    void processPasswordResetRequest(ForgotPasswordRequestDTO forgotPasswordRequestDTO);
    AuthResponseDTO refreshAccessToken(String refreshToken);
    String getCookieValue(HttpServletRequest request, String name);
}