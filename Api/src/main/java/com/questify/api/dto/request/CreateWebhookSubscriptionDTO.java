package com.questify.api.dto.request;

import com.questify.api.model.enums.WebhookEventType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

@Data
public class CreateWebhookSubscriptionDTO {

    @NotBlank
    @URL
    private String url;

    @NotNull
    private WebhookEventType eventType;

    @NotBlank
    private String description;
}
