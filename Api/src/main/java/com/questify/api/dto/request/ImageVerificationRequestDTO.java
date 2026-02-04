package com.questify.api.dto.request;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImageVerificationRequestDTO {
    private Long paintingId;
    private MultipartFile userImage;
}