# Questify Admin API Documentation

Deze documentatie beschrijft alle admin endpoints die zijn toegevoegd voor het beheren van musea, routes, schilderijen en route stops.

## Authenticatie

Alle admin endpoints vereisen de `@AllowAdmin` autorisatie. Dit betekent dat alleen gebruikers met admin rechten toegang hebben.

## Museum Management API

**Base URL:** `/api/admin/museums`

### Endpoints

#### 1. Alle musea ophalen
```
GET /api/admin/museums
```
Retourneert alle musea (inclusief inactieve).

**Response:** `List<MuseumDTO>`

---

#### 2. Museum ophalen op ID
```
GET /api/admin/museums/{id}
```
Retourneert een specifiek museum.

**Response:** `MuseumDTO`

---

#### 3. Museum aanmaken
```
POST /api/admin/museums
Content-Type: application/json
```

**Request Body:** `CreateMuseumDTO`
```json
{
  "name": "Museum naam",
  "address": "Museumstraat 1, Amsterdam",
  "description": "Beschrijving van het museum",
  "isActive": true
}
```

**Response:** `MuseumDTO` (HTTP 201 Created)

---

#### 4. Museum bijwerken
```
PUT /api/admin/museums/{id}
Content-Type: application/json
```

**Request Body:** `UpdateMuseumDTO`
```json
{
  "name": "Bijgewerkte naam",
  "address": "Nieuw adres",
  "description": "Nieuwe beschrijving",
  "isActive": true
}
```

**Response:** `MuseumDTO`

---

#### 5. Museum verwijderen
```
DELETE /api/admin/museums/{id}
```
Verwijdert een museum inclusief alle gekoppelde routes, schilderijen, etc.

**Response:** HTTP 204 No Content

---

#### 6. Museum activeren
```
POST /api/admin/museums/{id}/activate
```

**Response:** `MuseumDTO`

---

#### 7. Museum deactiveren
```
POST /api/admin/museums/{id}/deactivate
```

**Response:** `MuseumDTO`

---

## Route Management API

**Base URL:** `/api/admin/routes`

### Endpoints

#### 1. Alle routes ophalen
```
GET /api/admin/routes
```
Retourneert alle routes (inclusief inactieve).

**Response:** `List<RouteDTO>`

---

#### 2. Routes per museum ophalen
```
GET /api/admin/routes/museum/{museumId}
```

**Response:** `List<RouteDTO>`

---

#### 3. Route ophalen op ID
```
GET /api/admin/routes/{id}
```

**Response:** `RouteDTO`

---

#### 4. Route aanmaken
```
POST /api/admin/routes
Content-Type: application/json
```

**Request Body:** `CreateRouteDTO`
```json
{
  "museumId": 1,
  "name": "Route naam",
  "description": "Beschrijving van de route",
  "isActive": true
}
```

**Response:** `RouteDTO` (HTTP 201 Created)

---

#### 5. Route bijwerken
```
PUT /api/admin/routes/{id}
Content-Type: application/json
```

**Request Body:** `UpdateRouteDTO`
```json
{
  "name": "Bijgewerkte route naam",
  "description": "Nieuwe beschrijving",
  "isActive": true
}
```

**Response:** `RouteDTO`

---

#### 6. Route verwijderen
```
DELETE /api/admin/routes/{id}
```
Verwijdert een route inclusief alle route stops.

**Response:** HTTP 204 No Content

---

#### 7. Route activeren
```
POST /api/admin/routes/{id}/activate
```

**Response:** `RouteDTO`

---

#### 8. Route deactiveren
```
POST /api/admin/routes/{id}/deactivate
```

**Response:** `RouteDTO`

---

## Painting Management API

**Base URL:** `/api/admin/paintings`

### Endpoints

#### 1. Alle schilderijen ophalen
```
GET /api/admin/paintings
```

**Response:** `List<PaintingDetailDTO>`

---

#### 2. Schilderijen per museum ophalen
```
GET /api/admin/paintings/museum/{museumId}
```

**Response:** `List<PaintingDetailDTO>`

---

#### 3. Schilderij ophalen op ID
```
GET /api/admin/paintings/{id}
```

**Response:** `PaintingDetailDTO`

---

#### 4. Schilderij aanmaken
```
POST /api/admin/paintings
Content-Type: application/json
```

**Request Body:** `CreatePaintingDTO`
```json
{
  "museumId": 1,
  "title": "De Nachtwacht",
  "artist": "Rembrandt van Rijn",
  "year": 1642,
  "museumLabel": "SK-C-5",
  "imageRecognitionKey": "unique-key-for-image-recognition",
  "infoTitle": "Over De Nachtwacht",
  "infoText": "Gedetailleerde informatie over het schilderij...",
  "externalLink": "https://www.rijksmuseum.nl/nl/collectie/SK-C-5"
}
```

**Response:** `PaintingDetailDTO` (HTTP 201 Created)

---

#### 5. Schilderij bijwerken
```
PUT /api/admin/paintings/{id}
Content-Type: application/json
```

**Request Body:** `UpdatePaintingDTO`
```json
{
  "title": "Bijgewerkte titel",
  "artist": "Kunstenaar naam",
  "year": 1650,
  "museumLabel": "SK-123",
  "imageRecognitionKey": "updated-key",
  "infoTitle": "Nieuwe info titel",
  "infoText": "Nieuwe info tekst",
  "externalLink": "https://example.com"
}
```

**Response:** `PaintingDetailDTO`

---

#### 6. Schilderij verwijderen
```
DELETE /api/admin/paintings/{id}
```

**Response:** HTTP 204 No Content

---

## Route Stop Management API

**Base URL:** `/api/admin/route-stops`

### Endpoints

#### 1. Route stops ophalen
```
GET /api/admin/route-stops/route/{routeId}
```
Retourneert alle stops voor een route in volgorde.

**Response:** `List<RouteStopDTO>`

---

#### 2. Stop toevoegen aan route
```
POST /api/admin/route-stops/route/{routeId}
Content-Type: application/json
```

**Request Body:** `AddRouteStopDTO`
```json
{
  "paintingId": 5,
  "sequenceNumber": 1
}
```

**Validaties:**
- Schilderij moet tot hetzelfde museum behoren als de route
- Schilderij mag niet al in deze route zitten
- Sequence number moet uniek zijn binnen de route

**Response:** `RouteStopDTO` (HTTP 201 Created)

---

#### 3. Stop verwijderen uit route
```
DELETE /api/admin/route-stops/{routeStopId}
```

**Response:** HTTP 204 No Content

---

#### 4. Sequence number van stop bijwerken
```
PATCH /api/admin/route-stops/{routeStopId}/sequence?sequenceNumber={newNumber}
```

**Query Parameters:**
- `sequenceNumber`: Het nieuwe volgnummer

**Response:** `RouteStopDTO`

---

#### 5. Alle stops in route herordenen
```
PUT /api/admin/route-stops/route/{routeId}/reorder
Content-Type: application/json
```

**Request Body:** Array van route stop IDs in gewenste volgorde
```json
[3, 1, 5, 2, 4]
```

Dit zal automatisch de sequence numbers bijwerken naar 1, 2, 3, 4, 5 respectievelijk.

**Response:** `List<RouteStopDTO>`

---

## Data Models

### MuseumDTO
```json
{
  "museumId": 1,
  "name": "Rijksmuseum",
  "address": "Museumstraat 1, Amsterdam",
  "description": "Het nationale museum van Nederland",
  "isActive": true,
  "routes": [...]
}
```

### RouteDTO
```json
{
  "routeId": 1,
  "museumId": 1,
  "name": "Gouden Eeuw Route",
  "description": "Een tour door de Gouden Eeuw",
  "isActive": true,
  "totalStops": 5,
  "stops": [...]
}
```

### RouteStopDTO
```json
{
  "routeStopId": 1,
  "routeId": 1,
  "paintingId": 5,
  "sequenceNumber": 1,
  "painting": {...}
}
```

### PaintingDetailDTO
```json
{
  "paintingId": 1,
  "museumId": 1,
  "title": "De Nachtwacht",
  "artist": "Rembrandt van Rijn",
  "year": 1642,
  "museumLabel": "SK-C-5",
  "imageRecognitionKey": "unique-key",
  "infoTitle": "Over De Nachtwacht",
  "infoText": "Gedetailleerde info...",
  "externalLink": "https://...",
  "standardHints": [...],
  "extraHints": [...]
}
```

## Typische Workflow

### Een compleet museum opzetten

1. **Museum aanmaken**
```
POST /api/admin/museums
```

2. **Schilderijen toevoegen**
```
POST /api/admin/paintings (meerdere keren)
```

3. **Route aanmaken**
```
POST /api/admin/routes
```

4. **Schilderijen aan route toevoegen**
```
POST /api/admin/route-stops/route/{routeId} (voor elk schilderij)
```

5. **Route stops herordenen** (indien nodig)
```
PUT /api/admin/route-stops/route/{routeId}/reorder
```

6. **Museum activeren**
```
POST /api/admin/museums/{id}/activate
```

## Error Responses

### 400 Bad Request
```json
{
  "field1": "Validation error message",
  "field2": "Another validation error"
}
```

### 404 Not Found
```
"Museum not found with id: 123"
```

### 403 Forbidden
```
"Access denied"
```

### 500 Internal Server Error
```
"Something went wrong: error details"
```

## Notities

- Alle endpoints zijn beveiligd met `@AllowAdmin`
- Cascade delete: Het verwijderen van een museum verwijdert ook alle routes en schilderijen
- Orphan removal: Het verwijderen van een route verwijdert automatisch alle route stops
- Database constraints zorgen voor data-integriteit (unieke museum labels, sequence numbers, etc.)
