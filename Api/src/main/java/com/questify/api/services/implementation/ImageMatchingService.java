package com.questify.api.services.implementation;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;

@Slf4j
@Service
public class ImageMatchingService {

    private static final double MATCH_THRESHOLD = 0.65;

    @Value("${clip.service.url}")
    private String clipServiceUrl;

    private final RestTemplate restTemplate;

    public ImageMatchingService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Compare user-uploaded image with stored painting image via CLIP microservice
     *
     * @param userImage        User's photo (MultipartFile)
     * @param storedImagePath  Path to reference painting image (local temp file from MinIO)
     * @return Match score between 0.0 and 1.0
     */
    public double compareImages(MultipartFile userImage, String storedImagePath) throws IOException {
        try {
            byte[] storedBytes = Files.readAllBytes(Path.of(storedImagePath));
            byte[] userBytes = userImage.getBytes();

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("image1", new ByteArrayResource(userBytes) {
                @Override
                public String getFilename() { return "user.jpg"; }
            });
            body.add("image2", new ByteArrayResource(storedBytes) {
                @Override
                public String getFilename() { return "reference.jpg"; }
            });

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            ResponseEntity<Map> response = restTemplate.exchange(
                    clipServiceUrl + "/compare",
                    HttpMethod.POST,
                    new HttpEntity<>(body, headers),
                    Map.class
            );

            if (response.getBody() == null || !response.getBody().containsKey("score")) {
                log.error("CLIP service returned empty or invalid response");
                return 0.0;
            }

            double score = ((Number) response.getBody().get("score")).doubleValue();
            log.info("CLIP image matching score: {}", score);
            return score;

        } catch (Exception e) {
            log.error("CLIP vergelijking mislukt", e);
            return 0.0;
        }
    }

    /**
     * Check if match score meets threshold
     */
    public boolean isMatchValid(double score) {
        return score >= MATCH_THRESHOLD;
    }
}