package com.questify.api.exceptions;

public class JwtCreationException extends RuntimeException {
    public JwtCreationException(String message, Throwable cause) {
        super(message, cause);
    }
}