package com.questify.api.controller;

import com.questify.api.annotations.AllowAdmin;
import com.questify.api.dto.request.CreateWebhookSubscriptionDTO;
import com.questify.api.dto.response.WebhookSubscriptionDTO;
import com.questify.api.model.WebhookSubscription;
import com.questify.api.repository.WebhookSubscriptionRepository;
import com.questify.api.services.implementation.WebhookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/webhooks")
@AllowAdmin
@RequiredArgsConstructor
public class WebhookAdminController {

    private final WebhookSubscriptionRepository subscriptionRepository;
    private final WebhookService webhookService;

    @GetMapping
    public List<WebhookSubscriptionDTO> getAll() {
        return subscriptionRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    @PostMapping
    public ResponseEntity<WebhookSubscriptionDTO> create(@Valid @RequestBody CreateWebhookSubscriptionDTO dto) {
        WebhookSubscription subscription = WebhookSubscription.builder()
                .url(dto.getUrl())
                .eventType(dto.getEventType())
                .description(dto.getDescription())
                .active(true)
                .build();

        subscription = subscriptionRepository.save(subscription);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(subscription));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        subscriptionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/deactivate")
    public ResponseEntity<WebhookSubscriptionDTO> deactivate(@PathVariable Long id) {
        WebhookSubscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Webhook subscription not found"));
        subscription.setActive(false);
        return ResponseEntity.ok(toDTO(subscriptionRepository.save(subscription)));
    }

    @PostMapping("/{id}/activate")
    public ResponseEntity<WebhookSubscriptionDTO> activate(@PathVariable Long id) {
        WebhookSubscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Webhook subscription not found"));
        subscription.setActive(true);
        return ResponseEntity.ok(toDTO(subscriptionRepository.save(subscription)));
    }

    @PostMapping("/{id}/test")
    public ResponseEntity<Map<String, Object>> test(@PathVariable Long id) {
        WebhookSubscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Webhook subscription not found"));
        Map<String, Object> result = webhookService.test(subscription);
        return ResponseEntity.ok(result);
    }

    private WebhookSubscriptionDTO toDTO(WebhookSubscription s) {
        return WebhookSubscriptionDTO.builder()
                .id(s.getId())
                .url(s.getUrl())
                .eventType(s.getEventType())
                .description(s.getDescription())
                .active(s.isActive())
                .createdAt(s.getCreatedAt())
                .build();
    }
}
