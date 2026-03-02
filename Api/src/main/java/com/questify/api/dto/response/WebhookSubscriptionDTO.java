package com.questify.api.dto.response;

import com.questify.api.model.enums.WebhookEventType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class WebhookSubscriptionDTO {
    private Long id;
    private String url;
    private WebhookEventType eventType;
    private String description;
    private boolean active;
    private LocalDateTime createdAt;
}
