package com.questify.api.services.implementation;

import com.questify.api.model.UserRouteProgress;
import com.questify.api.model.enums.WebhookEventType;
import com.questify.api.repository.UserRouteProgressRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class LeaderboardSchedulerService {

    private final UserRouteProgressRepository progressRepository;
    private final WebhookService webhookService;

    /**
     * Every Monday at 08:00 — fire weekly leaderboard to Make.com
     */
    @Scheduled(cron = "0 0 8 * * MON")
    public void fireWeeklyLeaderboard() {
        log.info("Firing weekly leaderboard update");

        List<UserRouteProgress> completed = progressRepository.findAllByIsCompleted(true);

        List<Map<String, Object>> leaderboard = completed.stream()
                .collect(Collectors.groupingBy(p -> p.getUser().getId(), Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.<Long, Long>comparingByValue().reversed())
                .limit(10)
                .map(entry -> {
                    UserRouteProgress any = completed.stream()
                            .filter(p -> p.getUser().getId().equals(entry.getKey()))
                            .findFirst()
                            .orElseThrow();
                    return Map.<String, Object>of(
                            "userId", entry.getKey(),
                            "firstName", any.getUser().getFirstName(),
                            "lastName", any.getUser().getLastName(),
                            "completedRoutes", entry.getValue()
                    );
                })
                .collect(Collectors.toList());

        webhookService.fire(WebhookEventType.LEADERBOARD_UPDATE, Map.of(
                "weekOf", LocalDate.now().toString(),
                "leaderboard", leaderboard
        ));
    }
}
