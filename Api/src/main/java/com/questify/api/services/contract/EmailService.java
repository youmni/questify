package com.questify.api.services.contract;

import com.questify.api.model.User;

public interface EmailService {
    void sendActivationEmail(User user, String token);
    void sendPasswordResetEmail(User user, String token);
}