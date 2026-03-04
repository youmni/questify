package com.questify.api.repository;

import com.questify.api.model.WebhookSubscription;
import com.questify.api.model.enums.WebhookEventType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WebhookSubscriptionRepository extends JpaRepository<WebhookSubscription, Long> {
    List<WebhookSubscription> findByEventTypeAndActiveTrue(WebhookEventType eventType);
}
