package com.questify.api.model;

import com.questify.api.model.enums.HintType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "hints",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_hint_painting_type_order", columnNames = {"painting_id", "hint_type", "display_order"})
        }
)
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
public class Hint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long hintId;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "painting_id", nullable = false)
    @ToString.Exclude
    private Painting painting;

    @Enumerated(EnumType.STRING)
    @Column(name = "hint_type", nullable = false, length = 20)
    private HintType hintType;

    @Column(nullable = false, length = 1000)
    private String text;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;
}