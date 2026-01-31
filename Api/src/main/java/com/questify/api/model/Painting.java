package com.questify.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "paintings",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_painting_museum_label", columnNames = {"museum_id", "museum_label"}),
                @UniqueConstraint(name = "uk_painting_museum_recognition_key", columnNames = {"museum_id", "image_recognition_key"})
        }
)
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
public class Painting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long paintingId;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "museum_id", nullable = false)
    @ToString.Exclude
    private Museum museum;

    @Column(nullable = false, length = 300)
    @ToString.Include
    private String title;

    @Column(nullable = false, length = 200)
    @ToString.Include
    private String artist;

    private Integer year;

    @Column(name = "museum_label", length = 100)
    private String museumLabel;

    @Column(name = "image_recognition_key", nullable = false, length = 200)
    private String imageRecognitionKey;

    @Column(name = "info_title", length = 300)
    private String infoTitle;

    @Column(name = "info_text", length = 8000)
    private String infoText;

    @Column(name = "external_link", length = 500)
    private String externalLink;

    @JsonIgnore
    @OneToMany(mappedBy = "painting", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Hint> hints = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "painting", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<RouteStop> routeStops = new ArrayList<>();
}