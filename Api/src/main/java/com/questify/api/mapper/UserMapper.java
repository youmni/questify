package com.questify.api.mapper;

import com.questify.api.dto.request.RegistrationDTO;
import com.questify.api.dto.response.UserDTO;
import com.questify.api.model.User;
import com.questify.api.model.enums.UserType;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserDTO toDTO(User user){
        return UserDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .userType(String.valueOf(user.getUserType()))
                .enabled(user.isEnabled())
                .build();
    }

    public User toEntity(RegistrationDTO registrationDTO){
        return User.builder()
                .firstName(registrationDTO.getFirstName())
                .lastName(registrationDTO.getLastName())
                .email(registrationDTO.getEmail())
                .password(registrationDTO.getPassword())
                .userType(UserType.USER)
                .build();
    }
}