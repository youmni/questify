package com.questify.api.config;

import com.questify.api.model.*;
import com.questify.api.model.enums.HintType;
import com.questify.api.model.enums.UserType;
import com.questify.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.IntStream;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final MuseumRepository museumRepository;
    private final RouteRepository routeRepository;
    private final UserRepository userRepository;
    private final UserRouteProgressRepository progressRepository;
    private final UserPaintingScanRepository scanRepository;

    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        // Idempotent (simpel): als er al data is, niet opnieuw seeden
        if (museumRepository.count() > 0 || userRepository.count() > 0) return;

        // ---- USERS ----
        User admin = seedUser("Admin", "Questify", "admin@questify.local", "StrongP@ssw0rd!", UserType.ADMIN, true);
        User u1    = seedUser("Test", "UserA", "user.a@questify.local", "StrongP@ssw0rd!", UserType.USER, true);
        User u2    = seedUser("Test", "UserB", "user.b@questify.local", "StrongP@ssw0rd!", UserType.USER, true);

        // ---- MUSEUM 1: Oldmasters ----
        Museum oldmasters = Museum.builder()
                .name("Oldmasters Museum")
                .address("KMSKB, Regentschapsstraat 3, 1000 Brussel")
                .description("Fotospeurtocht met hints, extra hints en extra info per schilderij.")
                .isActive(true)
                .build();

        // Paintings museum 1
        List<Painting> omPaintings = new ArrayList<>();
        omPaintings.add(painting(oldmasters,
                "De Jacht in het Woud", "Voorbeeld Kunstenaar", 1650, "OM-01", "oldmasters_01",
                "Over dit schilderij", "Korte achtergrondinfo (vervang door echte info).",
                "https://www.fine-arts-museum.be/"
        ));
        omPaintings.add(painting(oldmasters,
                "Portret van een Edelvrouw", "Voorbeeld Kunstenaar", 1620, "OM-02", "oldmasters_02",
                "Waarom dit portret bijzonder is", "Info over kleding, status en techniek (vervang).",
                "https://www.fine-arts-museum.be/"
        ));
        omPaintings.add(painting(oldmasters,
                "Stilleven met Fruit", "Voorbeeld Kunstenaar", 1705, "OM-03", "oldmasters_03",
                "Symboliek in het stilleven", "Uitleg over vergankelijkheid en symbolen (vervang).",
                "https://www.fine-arts-museum.be/"
        ));
        omPaintings.add(painting(oldmasters,
                "Mythische Scène", "Voorbeeld Kunstenaar", 1610, "OM-04", "oldmasters_04",
                "Het verhaal achter de mythe", "Korte samenvatting van de mythe (vervang).",
                "https://www.fine-arts-museum.be/"
        ));
        omPaintings.add(painting(oldmasters,
                "Religieuze Voorstelling", "Voorbeeld Kunstenaar", 1680, "OM-05", "oldmasters_05",
                "Context en beeldtaal", "Uitleg over iconografie en compositie (vervang).",
                "https://www.fine-arts-museum.be/"
        ));
        omPaintings.add(painting(oldmasters,
                "Interieur met Kaarslicht", "Voorbeeld Kunstenaar", 1642, "OM-06", "oldmasters_06",
                "Licht en schaduw", "Waarom kaarslicht zo moeilijk is om te schilderen (vervang).",
                "https://www.fine-arts-museum.be/"
        ));
        omPaintings.add(painting(oldmasters,
                "Landschap met Rivier", "Voorbeeld Kunstenaar", 1671, "OM-07", "oldmasters_07",
                "Compositie van het landschap", "Dieptewerking en atmosferisch perspectief (vervang).",
                "https://www.fine-arts-museum.be/"
        ));
        oldmasters.getPaintings().addAll(omPaintings);

        // Hints museum 1 (meer uitgebreid: 3 standard + 2 extra per painting)
        for (Painting p : omPaintings) {
            addHints(p,
                    List.of(
                            "Kijk eerst naar de titelkaartjes in de buurt van " + safeLabel(p) + ".",
                            "Let op opvallende kleuren/contrasten die bij \"" + p.getTitle() + "\" passen.",
                            "Zoek een werk dat qua sfeer aansluit bij de zaal-indicatie: " + safeLocation(p)
                    ),
                    List.of(
                            "Extra tip: focus op details (handen/gezichten/lichtval) in de compositie.",
                            "Extra tip: scan pas wanneer je zeker bent dat je het correcte werk hebt."
                    )
            );
        }

        // Routes museum 1
        Route omRouteMain = Route.builder()
                .museum(oldmasters)
                .name("Speurtocht – Oldmasters (Main)")
                .description("Vind en scan de werken in volgorde. Na elke scan krijg je extra info.")
                .isActive(true)
                .build();

        Route omRouteKids = Route.builder()
                .museum(oldmasters)
                .name("Speurtocht – Oldmasters (Kids)")
                .description("Kortere route met minder stops (ideaal voor snelle demo).")
                .isActive(true)
                .build();

        Route omRouteInactive = Route.builder()
                .museum(oldmasters)
                .name("Speurtocht – Oldmasters (OLD)")
                .description("Oude route (inactief) om filtering op active routes te testen.")
                .isActive(false)
                .build();

        // Stops: main route = alle 7 paintings in volgorde
        addStopsInOrder(omRouteMain, omPaintings);

        // Kids route = subset
        addStopsInOrder(omRouteKids, List.of(
                omPaintings.get(0),
                omPaintings.get(2),
                omPaintings.get(4),
                omPaintings.get(6)
        ));

        // Inactieve route = 3 paintings
        addStopsInOrder(omRouteInactive, List.of(
                omPaintings.get(1),
                omPaintings.get(3),
                omPaintings.get(5)
        ));

        oldmasters.getRoutes().addAll(List.of(omRouteMain, omRouteKids, omRouteInactive));

        // ---- MUSEUM 2: Demo Museum (optioneel) ----
        Museum demo = Museum.builder()
                .name("Demo Museum")
                .address("Demo straat 1, 1000 Brussel")
                .description("Tweede museum om meerdere musea/routes te testen.")
                .isActive(true)
                .build();

        List<Painting> demoPaintings = List.of(
                painting(demo, "Abstract Werk 1", "Demo Artist", 2001, "DM-01", "demo_01",
                        "Abstractie", "Demo tekst (vervang).", "https://example.com"),
                painting(demo, "Abstract Werk 2", "Demo Artist", 2003, "DM-02", "demo_02",
                        "Kleurgebruik", "Demo tekst (vervang).", "https://example.com"),
                painting(demo, "Abstract Werk 3", "Demo Artist", 2008, "DM-03", "demo_03",
                        "Vorm en ritme", "Demo tekst (vervang).", "https://example.com"),
                painting(demo, "Abstract Werk 4", "Demo Artist", 2012, "DM-04", "demo_04",
                        "Textuur", "Demo tekst (vervang).", "https://example.com")
        );
        demo.getPaintings().addAll(demoPaintings);

        for (Painting p : demoPaintings) {
            addHints(p,
                    List.of("Zoek een abstract werk met sterke vormen.", "Let op het label: " + safeLabel(p)),
                    List.of("Extra tip: vergelijk de kleuren met de omliggende werken.")
            );
        }

        Route demoRoute = Route.builder()
                .museum(demo)
                .name("Demo Route – Modern")
                .description("Route om demo/test scenario’s te oefenen.")
                .isActive(true)
                .build();

        addStopsInOrder(demoRoute, demoPaintings);
        demo.getRoutes().add(demoRoute);

        // ---- SAVE musea (cascade: paintings/hints/routes/stops) ----
        museumRepository.save(oldmasters);
        museumRepository.save(demo);

        // ---- DEMO PROGRESS + SCANS ----
        // UserA: halfweg in omRouteMain (bv. 3 scans gedaan, currentStopNumber = 4)
        seedProgressAndScans(u1, omRouteMain, 3, false);

        // UserB: volledig completed omRouteMain (alle stops gescand)
        seedProgressAndScans(u2, omRouteMain, omRouteMain.getStops().size(), true);
    }

    // -----------------------
    // Helpers
    // -----------------------

    private User seedUser(String first, String last, String email, String rawPassword, UserType type, boolean enabled) {
        User u = User.builder()
                .firstName(first)
                .lastName(last)
                .email(email)
                .password(passwordEncoder.encode(rawPassword))
                .userType(type)
                .enabled(enabled)
                .activationToken(null)
                .build();
        return userRepository.save(u);
    }

    private Painting painting(
            Museum museum,
            String title,
            String artist,
            Integer year,
            String museumLabel,
            String recognitionKey,
            String infoTitle,
            String infoText,
            String externalLink
    ) {
        return Painting.builder()
                .museum(museum)
                .title(title)
                .artist(artist)
                .year(year)
                .museumLabel(museumLabel)
                .imageRecognitionKey(recognitionKey)
                .infoTitle(infoTitle)
                .infoText(infoText)
                .externalLink(externalLink)
                .build();
    }

    private void addHints(Painting painting, List<String> standard, List<String> extra) {
        int order = 1;
        for (String s : standard) {
            painting.getHints().add(Hint.builder()
                    .painting(painting)
                    .hintType(HintType.STANDARD)
                    .text(s)
                    .displayOrder(order++)
                    .build());
        }
        order = 1;
        for (String s : extra) {
            painting.getHints().add(Hint.builder()
                    .painting(painting)
                    .hintType(HintType.EXTRA)
                    .text(s)
                    .displayOrder(order++)
                    .build());
        }
    }

    private void addStopsInOrder(Route route, List<Painting> paintingsInOrder) {
        IntStream.range(0, paintingsInOrder.size()).forEach(i -> {
            route.getStops().add(RouteStop.builder()
                    .route(route)
                    .painting(paintingsInOrder.get(i))
                    .sequenceNumber(i + 1)
                    .build());
        });
    }

    /**
     * seed scans + progress
     * scannedCount = hoeveel stops als "gevonden" worden toegevoegd (vanaf start van route)
     * completed = of route als completed gemarkeerd wordt
     */
    private void seedProgressAndScans(User user, Route route, int scannedCount, boolean completed) {

        // Maak progress record
        UserRouteProgress progress = UserRouteProgress.builder()
                .user(user)
                .route(route)
                .currentStopNumber(Math.min(scannedCount + 1, route.getStops().size()))
                .isCompleted(completed)
                .completedAt(completed ? LocalDateTime.now() : null)
                .build();
        progressRepository.save(progress);

        // Voeg scans toe (eerste N stops)
        int n = Math.min(scannedCount, route.getStops().size());
        for (int i = 0; i < n; i++) {
            Painting p = route.getStops().get(i).getPainting();

            // confidence_score verplicht + uniek per (user, painting, route)
            UserPaintingScan scan = UserPaintingScan.builder()
                    .user(user)
                    .route(route)
                    .painting(p)
                    .confidenceScore(0.92 + (i * 0.01)) // demo values
                    .build();

            scanRepository.save(scan);
        }
    }

    private String safeLabel(Painting p) {
        return p.getMuseumLabel() != null ? p.getMuseumLabel() : "geen label";
    }

    private String safeLocation(Painting p) {
        // je model heeft geen "zaal"-field, dus museumLabel is vaak de enige “locatie” indicator
        return p.getMuseumLabel() != null ? p.getMuseumLabel() : "onbekend";
    }
}
