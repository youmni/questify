package com.questify.api.exceptions;

public class AccountBlacklistedException extends RuntimeException {
    public AccountBlacklistedException(String message) {
        super(message);
    }
}