package com.questify.api.services.implementation;

import com.questify.api.model.WebhookSubscription;
import com.questify.api.model.enums.WebhookEventType;
import com.questify.api.repository.WebhookSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class WebhookService {

    private final WebhookSubscriptionRepository subscriptionRepository;
    private final RestTemplate restTemplate;

    @Async
    public void fire(WebhookEventType eventType, Map<String, Object> data) {
        List<WebhookSubscription> subscriptions = subscriptionRepository.findByEventTypeAndActiveTrue(eventType);

        if (subscriptions.isEmpty()) return;

        Map<String, Object> payload = new HashMap<>();
        payload.put("event", eventType.name());
        payload.put("timestamp", OffsetDateTime.now().toString());
        payload.put("data", data);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        for (WebhookSubscription subscription : subscriptions) {
            try {
                ResponseEntity<String> response = restTemplate.postForEntity(subscription.getUrl(), request, String.class);
                log.info("Webhook fired: {} -> {} (status: {})", eventType, subscription.getUrl(), response.getStatusCode());
            } catch (HttpStatusCodeException e) {
                log.warn("Webhook delivery failed for {} with HTTP {}: {}", subscription.getUrl(), e.getStatusCode(), e.getResponseBodyAsString());
            } catch (Exception e) {
                log.warn("Webhook delivery failed for {}: {}", subscription.getUrl(), e.getMessage());
            }
        }
    }

    public Map<String, Object> test(WebhookSubscription subscription) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("event", subscription.getEventType().name());
        payload.put("timestamp", OffsetDateTime.now().toString());
        payload.put("data", Map.of("test", true, "message", "Questify webhook test"));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(subscription.getUrl(), request, String.class);
            return Map.of("success", true, "status", response.getStatusCode().value(), "body", response.getBody() != null ? response.getBody() : "");
        } catch (HttpStatusCodeException e) {
            return Map.of("success", false, "status", e.getStatusCode().value(), "body", e.getResponseBodyAsString());
        } catch (Exception e) {
            return Map.of("success", false, "status", 0, "body", e.getMessage());
        }
    }
}
