package com.questify.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "museums")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
public class Museum {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long museumId;

    @Column(nullable = false, length = 200)
    @ToString.Include
    private String name;

    @Column(nullable = false, length = 400)
    private String address;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    @Builder.Default
    private boolean isActive = true;

    @JsonIgnore
    @OneToMany(mappedBy = "museum", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Route> routes = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "museum", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Painting> paintings = new ArrayList<>();
}