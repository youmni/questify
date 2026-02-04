package com.questify.api.exceptions;

import com.questify.api.dto.response.AuthResponseDTO;
import com.nimbusds.jose.JOSEException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<String> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body("Invalid data: " + ex.getMostSpecificCause().getMessage());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<String> handleAccessDeniedException(AccessDeniedException ex) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("Access denied");
    }

    @ExceptionHandler(EmailSendingException.class)
    public ResponseEntity<String> handleEmailSending(EmailSendingException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Email could not be sent: " + ex.getMessage());
    }

    @ExceptionHandler(JOSEException.class)
    public ResponseEntity<AuthResponseDTO> handleJoseException(JOSEException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new AuthResponseDTO(false, "Could not generate token: " + ex.getMessage(), null, null));
    }

    @ExceptionHandler(JwtParseException.class)
    public ResponseEntity<String> handleJwtParseException(JwtParseException ex) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("Invalid JWT token: " + ex.getMessage());
    }

    @ExceptionHandler(JwtCreationException.class)
    public ResponseEntity<String> handleJwtParseCreationException(JwtCreationException ex) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error creating JWT token: " + ex.getMessage());
    }

    @ExceptionHandler(AccountNotActivatedException.class)
    public ResponseEntity<AuthResponseDTO> handleNotActivated(AccountNotActivatedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new AuthResponseDTO(false, ex.getMessage(), null, null));
    }

    @ExceptionHandler(AccountBlacklistedException.class)
    public ResponseEntity<AuthResponseDTO> handleAccountBlacklistedException(AccountBlacklistedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new AuthResponseDTO(false, ex.getMessage(), null, null));
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<AuthResponseDTO> handleInvalidCredentials(InvalidCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new AuthResponseDTO(false, ex.getMessage(), null, null));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleResourceNotFound(ResourceNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ex.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneralException(Exception ex) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Something went wrong: " + ex.getMessage());
    }
}