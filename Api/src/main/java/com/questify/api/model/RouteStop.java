package com.questify.api.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "route_stops",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_route_stop_route_sequence", columnNames = {"route_id", "sequence_number"}),
                @UniqueConstraint(name = "uk_route_stop_route_painting", columnNames = {"route_id", "painting_id"})
        }
)
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
public class RouteStop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long routeStopId;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", nullable = false)
    @ToString.Exclude
    private Route route;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "painting_id", nullable = false)
    @ToString.Exclude
    private Painting painting;

    @Column(name = "sequence_number", nullable = false)
    private Integer sequenceNumber;
}