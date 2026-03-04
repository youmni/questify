package com.questify.api.services.implementation;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class ClaudeService {

    private static final String ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
    private static final String MODEL = "claude-haiku-4-5-20251001";

    @Value("${anthropic.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate;

    public ClaudeService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Generate 2 fun facts about a painting in Dutch.
     * Returns empty string if the API call fails.
     */
    public String getPaintingFunFact(String title, String artist) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-api-key", apiKey);
            headers.set("anthropic-version", "2023-06-01");

            Map<String, Object> body = Map.of(
                    "model", MODEL,
                    "max_tokens", 200,
                    "messages", List.of(
                            Map.of("role", "user", "content",
                                    "Geef 2 korte, interessante fun facts over het schilderij \""
                                    + title + "\" van " + artist + ". "
                                    + "Schrijf in het Nederlands. Geen inleiding, alleen de 2 feiten, elk op een nieuwe regel.")
                    )
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(ANTHROPIC_URL, request, Map.class);

            if (response != null && response.containsKey("content")) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> content = (List<Map<String, Object>>) response.get("content");
                if (!content.isEmpty()) {
                    return (String) content.get(0).get("text");
                }
            }
        } catch (Exception e) {
            log.warn("Claude API call failed for painting '{}': {}", title, e.getMessage());
        }
        return "";
    }
}
