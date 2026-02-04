package com.questify.api.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "user_painting_scans",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_user_painting_route", columnNames = {"user_id", "painting_id", "route_id"})
        },
        indexes = {
                @Index(name = "idx_user_route", columnList = "user_id, route_id")
        }
)
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class UserPaintingScan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long scanId;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "painting_id", nullable = false)
    private Painting painting;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", nullable = false)
    private Route route;

    @Column(name = "confidence_score", nullable = false)
    private Double confidenceScore;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime scannedAt;
}