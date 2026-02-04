# Questify Admin API - Complete Testing Guide

Deze guide bevat alle URLs, JSON payloads en een complete testflow om het hele systeem te testen.

## 🔐 Authenticatie

Alle requests vereisen authenticatie met admin rechten. Voeg deze header toe aan elke request:
```
Authorization: Bearer {your-jwt-token}
```

## 📍 Base URL
```
http://localhost:8080
```

---

## 🧪 COMPLETE TESTFLOW - Van niets tot werkend museum

### Stap 1: Museum Aanmaken

**Endpoint:**
```
POST http://localhost:8080/api/admin/museums
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {your-token}
```

**JSON Body:**
```json
{
  "name": "Rijksmuseum Amsterdam",
  "address": "Museumstraat 1, 1071 XX Amsterdam",
  "description": "Het Rijksmuseum is een Nederlands nationaal museum gewijd aan kunst en geschiedenis in Amsterdam. Het museum werd geopend in 1885 en toont 8000 objecten uit de collectie.",
  "isActive": true
}
```

**Verwachte Response (201 Created):**
```json
{
  "museumId": 1,
  "name": "Rijksmuseum Amsterdam",
  "address": "Museumstraat 1, 1071 XX Amsterdam",
  "description": "Het Rijksmuseum is een Nederlands nationaal museum...",
  "isActive": true,
  "routes": []
}
```

**💾 Bewaar: `museumId = 1`**

---

### Stap 2: Schilderijen Toevoegen

#### Schilderij 1: De Nachtwacht

**Endpoint:**
```
POST http://localhost:8080/api/admin/paintings
```

**JSON Body:**
```json
{
  "museumId": 1,
  "title": "De Nachtwacht",
  "artist": "Rembrandt van Rijn",
  "year": 1642,
  "museumLabel": "SK-C-5",
  "imageRecognitionKey": "rijksmuseum-nachtwacht-sk-c-5",
  "infoTitle": "Het meesterwerk van Rembrandt",
  "infoText": "De Nachtwacht is het beroemdste schilderij van Rembrandt en één van de bekendste kunstwerken ter wereld. Het schilderij toont het korporaalschap van kapitein Frans Banninck Cocq en luitenant Willem van Ruytenburgh. Het werd geschilderd in opdracht van de Kloveniersdoelen in Amsterdam.",
  "externalLink": "https://www.rijksmuseum.nl/nl/collectie/SK-C-5"
}
```

**Verwachte Response (201 Created):**
```json
{
  "paintingId": 1,
  "museumId": 1,
  "title": "De Nachtwacht",
  "artist": "Rembrandt van Rijn",
  "year": 1642,
  "museumLabel": "SK-C-5",
  "imageRecognitionKey": "rijksmuseum-nachtwacht-sk-c-5",
  "infoTitle": "Het meesterwerk van Rembrandt",
  "infoText": "De Nachtwacht is het beroemdste schilderij...",
  "externalLink": "https://www.rijksmuseum.nl/nl/collectie/SK-C-5",
  "standardHints": null,
  "extraHints": null
}
```

**💾 Bewaar: `paintingId = 1`**

---

#### Schilderij 2: Het Melkmeisje

**Endpoint:**
```
POST http://localhost:8080/api/admin/paintings
```

**JSON Body:**
```json
{
  "museumId": 1,
  "title": "Het Melkmeisje",
  "artist": "Johannes Vermeer",
  "year": 1660,
  "museumLabel": "SK-A-2344",
  "imageRecognitionKey": "rijksmuseum-melkmeisje-sk-a-2344",
  "infoTitle": "Vermeer's iconisch genre stuk",
  "infoText": "Het Melkmeisje is een schilderij van Johannes Vermeer. Het toont een dienstmeid die melk schenkt in een aardewerken kom. Het schilderij staat bekend om zijn gebruik van licht en kleur, en de realistische weergave van het dagelijks leven.",
  "externalLink": "https://www.rijksmuseum.nl/nl/collectie/SK-A-2344"
}
```

**💾 Bewaar: `paintingId = 2`**

---

#### Schilderij 3: De Joodse Bruid

**Endpoint:**
```
POST http://localhost:8080/api/admin/paintings
```

**JSON Body:**
```json
{
  "museumId": 1,
  "title": "De Joodse Bruid",
  "artist": "Rembrandt van Rijn",
  "year": 1665,
  "museumLabel": "SK-C-216",
  "imageRecognitionKey": "rijksmuseum-joodse-bruid-sk-c-216",
  "infoTitle": "Rembrandts meest intieme portret",
  "infoText": "De Joodse bruid is een dubbelportret geschilderd door Rembrandt. Het werk wordt beschouwd als een van de mooiste liefdesschilderijen in de kunstgeschiedenis. De identiteit van het geportretteerde paar is niet met zekerheid vastgesteld.",
  "externalLink": "https://www.rijksmuseum.nl/nl/collectie/SK-C-216"
}
```

**💾 Bewaar: `paintingId = 3`**

---

#### Schilderij 4: De Bedreigde Zwaan

**Endpoint:**
```
POST http://localhost:8080/api/admin/paintings
```

**JSON Body:**
```json
{
  "museumId": 1,
  "title": "De Bedreigde Zwaan",
  "artist": "Jan Asselijn",
  "year": 1650,
  "museumLabel": "SK-A-4",
  "imageRecognitionKey": "rijksmuseum-bedreigde-zwaan-sk-a-4",
  "infoTitle": "Het symbool van Nederlandse trots",
  "infoText": "De Bedreigde Zwaan toont een zwaan die haar nest verdedigt tegen een hond. Het schilderij werd al snel geïnterpreteerd als een politieke allegorie: de zwaan symboliseert de Nederlandse staatsman Johan de Witt die Nederland verdedigt tegen zijn vijanden.",
  "externalLink": "https://www.rijksmuseum.nl/nl/collectie/SK-A-4"
}
```

**💾 Bewaar: `paintingId = 4`**

---

#### Schilderij 5: Zelfportret als Apostel Paulus

**Endpoint:**
```
POST http://localhost:8080/api/admin/paintings
```

**JSON Body:**
```json
{
  "museumId": 1,
  "title": "Zelfportret als Apostel Paulus",
  "artist": "Rembrandt van Rijn",
  "year": 1661,
  "museumLabel": "SK-A-4050",
  "imageRecognitionKey": "rijksmuseum-zelfportret-paulus-sk-a-4050",
  "infoTitle": "Rembrandt in religieuze rol",
  "infoText": "In dit zelfportret stelt Rembrandt zichzelf voor als de apostel Paulus. Hij houdt een manuscript vast, waarschijnlijk een van Paulus' brieven. Het werk laat Rembrandts meesterschap in het schilderen van innerlijke emotie en contemplatie zien.",
  "externalLink": "https://www.rijksmuseum.nl/nl/collectie/SK-A-4050"
}
```

**💾 Bewaar: `paintingId = 5`**

---

### Stap 3: Routes Aanmaken

#### Route 1: Gouden Eeuw Hoogtepunten

**Endpoint:**
```
POST http://localhost:8080/api/admin/routes
```

**JSON Body:**
```json
{
  "museumId": 1,
  "name": "Gouden Eeuw Hoogtepunten",
  "description": "Een tour langs de beroemdste meesterwerken uit de Nederlandse Gouden Eeuw. Deze route voert je langs iconische werken van Rembrandt en Vermeer.",
  "isActive": true
}
```

**Verwachte Response (201 Created):**
```json
{
  "routeId": 1,
  "museumId": 1,
  "name": "Gouden Eeuw Hoogtepunten",
  "description": "Een tour langs de beroemdste meesterwerken...",
  "isActive": true,
  "totalStops": null,
  "stops": []
}
```

**💾 Bewaar: `routeId = 1`**

---

#### Route 2: Rembrandt Special

**Endpoint:**
```
POST http://localhost:8080/api/admin/routes
```

**JSON Body:**
```json
{
  "museumId": 1,
  "name": "Rembrandt Special",
  "description": "Focus op de meesterwerken van Rembrandt van Rijn. Ontdek zijn ontwikkeling als kunstenaar door de verschillende periodes van zijn leven.",
  "isActive": true
}
```

**💾 Bewaar: `routeId = 2`**

---

### Stap 4: Route Stops Toevoegen aan Route 1

#### Stop 1: De Nachtwacht

**Endpoint:**
```
POST http://localhost:8080/api/admin/route-stops/route/1
```

**JSON Body:**
```json
{
  "paintingId": 1,
  "sequenceNumber": 1
}
```

**Verwachte Response (201 Created):**
```json
{
  "routeStopId": 1,
  "routeId": 1,
  "paintingId": 1,
  "sequenceNumber": 1,
  "painting": null
}
```

---

#### Stop 2: Het Melkmeisje

**Endpoint:**
```
POST http://localhost:8080/api/admin/route-stops/route/1
```

**JSON Body:**
```json
{
  "paintingId": 2,
  "sequenceNumber": 2
}
```

---

#### Stop 3: De Joodse Bruid

**Endpoint:**
```
POST http://localhost:8080/api/admin/route-stops/route/1
```

**JSON Body:**
```json
{
  "paintingId": 3,
  "sequenceNumber": 3
}
```

---

#### Stop 4: De Bedreigde Zwaan

**Endpoint:**
```
POST http://localhost:8080/api/admin/route-stops/route/1
```

**JSON Body:**
```json
{
  "paintingId": 4,
  "sequenceNumber": 4
}
```

---

### Stap 5: Route Stops Toevoegen aan Route 2 (Rembrandt Special)

**Endpoint:**
```
POST http://localhost:8080/api/admin/route-stops/route/2
```

**Stop 1 - JSON Body:**
```json
{
  "paintingId": 1,
  "sequenceNumber": 1
}
```

**Stop 2 - JSON Body:**
```json
{
  "paintingId": 3,
  "sequenceNumber": 2
}
```

**Stop 3 - JSON Body:**
```json
{
  "paintingId": 5,
  "sequenceNumber": 3
}
```

---

### Stap 6: Verificatie - Alles Ophalen

#### Museum met alle routes ophalen

**Endpoint:**
```
GET http://localhost:8080/api/admin/museums/1
```

**Verwachte Response:**
```json
{
  "museumId": 1,
  "name": "Rijksmuseum Amsterdam",
  "address": "Museumstraat 1, 1071 XX Amsterdam",
  "description": "Het Rijksmuseum is een Nederlands nationaal museum...",
  "isActive": true,
  "routes": [
    {
      "routeId": 1,
      "name": "Gouden Eeuw Hoogtepunten",
      "description": "Een tour langs de beroemdste meesterwerken...",
      "isActive": true
    },
    {
      "routeId": 2,
      "name": "Rembrandt Special",
      "description": "Focus op de meesterwerken van Rembrandt...",
      "isActive": true
    }
  ]
}
```

---

#### Route details met alle stops ophalen

**Endpoint:**
```
GET http://localhost:8080/api/admin/routes/1
```

**Verwachte Response:**
```json
{
  "routeId": 1,
  "museumId": 1,
  "name": "Gouden Eeuw Hoogtepunten",
  "description": "Een tour langs de beroemdste meesterwerken...",
  "isActive": true,
  "totalStops": null,
  "stops": [
    {
      "routeStopId": 1,
      "routeId": 1,
      "paintingId": 1,
      "sequenceNumber": 1,
      "painting": null
    },
    {
      "routeStopId": 2,
      "routeId": 1,
      "paintingId": 2,
      "sequenceNumber": 2,
      "painting": null
    },
    {
      "routeStopId": 3,
      "routeId": 1,
      "paintingId": 3,
      "sequenceNumber": 3,
      "painting": null
    },
    {
      "routeStopId": 4,
      "routeId": 1,
      "paintingId": 4,
      "sequenceNumber": 4,
      "painting": null
    }
  ]
}
```

---

#### Route stops in volgorde ophalen

**Endpoint:**
```
GET http://localhost:8080/api/admin/route-stops/route/1
```

---

#### Alle schilderijen van museum ophalen

**Endpoint:**
```
GET http://localhost:8080/api/admin/paintings/museum/1
```

---

## 🔄 UPDATE OPERATIES TESTEN

### Museum Bijwerken

**Endpoint:**
```
PUT http://localhost:8080/api/admin/museums/1
```

**JSON Body:**
```json
{
  "name": "Rijksmuseum Amsterdam - Nationaal Museum",
  "address": "Museumstraat 1, 1071 XX Amsterdam, Nederland",
  "description": "Het Rijksmuseum is een Nederlands nationaal museum gewijd aan kunst en geschiedenis in Amsterdam. Het museum werd geopend in 1885.",
  "isActive": true
}
```

---

### Route Bijwerken

**Endpoint:**
```
PUT http://localhost:8080/api/admin/routes/1
```

**JSON Body:**
```json
{
  "name": "Gouden Eeuw Meesterwerken",
  "description": "Ontdek de hoogtepunten van de Nederlandse Gouden Eeuw in 45 minuten.",
  "isActive": true
}
```

---

### Schilderij Bijwerken

**Endpoint:**
```
PUT http://localhost:8080/api/admin/paintings/1
```

**JSON Body:**
```json
{
  "title": "De Nachtwacht (Het korporaalschap van Frans Banninck Cocq)",
  "artist": "Rembrandt Harmenszoon van Rijn",
  "year": 1642,
  "museumLabel": "SK-C-5",
  "imageRecognitionKey": "rijksmuseum-nachtwacht-sk-c-5",
  "infoTitle": "Het meesterwerk van Rembrandt - De Nachtwacht",
  "infoText": "De Nachtwacht is het beroemdste schilderij van Rembrandt en één van de bekendste kunstwerken ter wereld. Geschilderd in 1642 in opdracht van de Kloveniersdoelen.",
  "externalLink": "https://www.rijksmuseum.nl/nl/collectie/SK-C-5"
}
```

---

### Route Stop Sequence Number Aanpassen

**Endpoint:**
```
PATCH http://localhost:8080/api/admin/route-stops/2/sequence?sequenceNumber=5
```

Dit verplaatst route stop 2 (Het Melkmeisje) naar positie 5.

---

### Alle Stops Herordenen (Bulk Reorder)

**Endpoint:**
```
PUT http://localhost:8080/api/admin/route-stops/route/1/reorder
```

**JSON Body (array van routeStopIds in gewenste volgorde):**
```json
[4, 1, 3, 2]
```

Dit zet de volgorde om naar:
1. De Bedreigde Zwaan (was 4, nu 1)
2. De Nachtwacht (was 1, nu 2)
3. De Joodse Bruid (was 3, nu 3)
4. Het Melkmeisje (was 2, nu 4)

---

## 🔀 ACTIVEREN/DEACTIVEREN

### Museum Deactiveren

**Endpoint:**
```
POST http://localhost:8080/api/admin/museums/1/deactivate
```

**Response:**
```json
{
  "museumId": 1,
  "name": "Rijksmuseum Amsterdam",
  "isActive": false,
  ...
}
```

---

### Museum Activeren

**Endpoint:**
```
POST http://localhost:8080/api/admin/museums/1/activate
```

---

### Route Deactiveren

**Endpoint:**
```
POST http://localhost:8080/api/admin/routes/1/deactivate
```

---

### Route Activeren

**Endpoint:**
```
POST http://localhost:8080/api/admin/routes/1/activate
```

---

## 🗑️ DELETE OPERATIES

### Route Stop Verwijderen

**Endpoint:**
```
DELETE http://localhost:8080/api/admin/route-stops/2
```

**Response:** 204 No Content

---

### Schilderij Verwijderen

**Endpoint:**
```
DELETE http://localhost:8080/api/admin/paintings/5
```

**Response:** 204 No Content

**⚠️ Let op:** Als het schilderij in route stops zit, worden deze ook verwijderd (cascade).

---

### Route Verwijderen

**Endpoint:**
```
DELETE http://localhost:8080/api/admin/routes/2
```

**Response:** 204 No Content

**⚠️ Let op:** Alle route stops van deze route worden ook verwijderd.

---

### Museum Verwijderen

**Endpoint:**
```
DELETE http://localhost:8080/api/admin/museums/1
```

**Response:** 204 No Content

**⚠️ Let op:** Alle routes, schilderijen, en route stops worden ook verwijderd (cascade delete).

---

## 📋 OVERZICHT ENDPOINTS - ALLE REQUESTS

### Museums

```
GET    http://localhost:8080/api/admin/museums
GET    http://localhost:8080/api/admin/museums/{id}
POST   http://localhost:8080/api/admin/museums
PUT    http://localhost:8080/api/admin/museums/{id}
DELETE http://localhost:8080/api/admin/museums/{id}
POST   http://localhost:8080/api/admin/museums/{id}/activate
POST   http://localhost:8080/api/admin/museums/{id}/deactivate
```

### Routes

```
GET    http://localhost:8080/api/admin/routes
GET    http://localhost:8080/api/admin/routes/museum/{museumId}
GET    http://localhost:8080/api/admin/routes/{id}
POST   http://localhost:8080/api/admin/routes
PUT    http://localhost:8080/api/admin/routes/{id}
DELETE http://localhost:8080/api/admin/routes/{id}
POST   http://localhost:8080/api/admin/routes/{id}/activate
POST   http://localhost:8080/api/admin/routes/{id}/deactivate
```

### Paintings

```
GET    http://localhost:8080/api/admin/paintings
GET    http://localhost:8080/api/admin/paintings/museum/{museumId}
GET    http://localhost:8080/api/admin/paintings/{id}
POST   http://localhost:8080/api/admin/paintings
PUT    http://localhost:8080/api/admin/paintings/{id}
DELETE http://localhost:8080/api/admin/paintings/{id}
```

### Route Stops

```
GET    http://localhost:8080/api/admin/route-stops/route/{routeId}
POST   http://localhost:8080/api/admin/route-stops/route/{routeId}
DELETE http://localhost:8080/api/admin/route-stops/{routeStopId}
PATCH  http://localhost:8080/api/admin/route-stops/{routeStopId}/sequence?sequenceNumber={number}
PUT    http://localhost:8080/api/admin/route-stops/route/{routeId}/reorder
```

---

## 🧪 ERROR SCENARIO'S TESTEN

### 1. Schilderij toevoegen aan verkeerd museum

**Endpoint:**
```
POST http://localhost:8080/api/admin/route-stops/route/1
```

**JSON (stel museum 2 heeft painting 10):**
```json
{
  "paintingId": 10,
  "sequenceNumber": 5
}
```

**Verwachte Response (400 Bad Request):**
```
"Painting must belong to the same museum as the route"
```

---

### 2. Duplicate Sequence Number

**Endpoint:**
```
POST http://localhost:8080/api/admin/route-stops/route/1
```

**JSON:**
```json
{
  "paintingId": 5,
  "sequenceNumber": 1
}
```

**Verwachte Response (400 Bad Request):**
```
"Sequence number already exists in this route"
```

---

### 3. Duplicate Painting in Route

Probeer hetzelfde schilderij twee keer toe te voegen aan dezelfde route.

**Endpoint:**
```
POST http://localhost:8080/api/admin/route-stops/route/1
```

**JSON:**
```json
{
  "paintingId": 1,
  "sequenceNumber": 10
}
```

**Verwachte Response (400 Bad Request):**
```
"Painting already exists in this route"
```

---

### 4. Museum Not Found

**Endpoint:**
```
GET http://localhost:8080/api/admin/museums/99999
```

**Verwachte Response (404 Not Found):**
```
"Museum not found with id: 99999"
```

---

### 5. Validatie Fouten

**Endpoint:**
```
POST http://localhost:8080/api/admin/museums
```

**JSON (lege naam):**
```json
{
  "name": "",
  "address": "Test",
  "description": "Test"
}
```

**Verwachte Response (400 Bad Request):**
```json
{
  "name": "Museum name is required"
}
```

---

## 📱 POSTMAN COLLECTION

Importeer deze collection in Postman voor snelle testing:

### Environment Variables
```json
{
  "baseUrl": "http://localhost:8080",
  "token": "your-jwt-token-here",
  "museumId": "1",
  "routeId": "1",
  "paintingId": "1",
  "routeStopId": "1"
}
```

---

## 🔧 cURL Commands

### Museum Aanmaken (cURL)
```bash
curl -X POST http://localhost:8080/api/admin/museums \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Rijksmuseum Amsterdam",
    "address": "Museumstraat 1, 1071 XX Amsterdam",
    "description": "Het Rijksmuseum is een Nederlands nationaal museum",
    "isActive": true
  }'
```

### Schilderij Aanmaken (cURL)
```bash
curl -X POST http://localhost:8080/api/admin/paintings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "museumId": 1,
    "title": "De Nachtwacht",
    "artist": "Rembrandt van Rijn",
    "year": 1642,
    "museumLabel": "SK-C-5",
    "imageRecognitionKey": "rijksmuseum-nachtwacht-sk-c-5",
    "infoTitle": "Het meesterwerk van Rembrandt",
    "infoText": "De Nachtwacht is het beroemdste schilderij van Rembrandt",
    "externalLink": "https://www.rijksmuseum.nl/nl/collectie/SK-C-5"
  }'
```

### Route Aanmaken (cURL)
```bash
curl -X POST http://localhost:8080/api/admin/routes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "museumId": 1,
    "name": "Gouden Eeuw Hoogtepunten",
    "description": "Een tour langs de beroemdste meesterwerken",
    "isActive": true
  }'
```

### Route Stop Toevoegen (cURL)
```bash
curl -X POST http://localhost:8080/api/admin/route-stops/route/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "paintingId": 1,
    "sequenceNumber": 1
  }'
```

### Museum Ophalen (cURL)
```bash
curl -X GET http://localhost:8080/api/admin/museums/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Route Stop Verwijderen (cURL)
```bash
curl -X DELETE http://localhost:8080/api/admin/route-stops/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📊 TESTFLOW CHECKLIST

- [ ] Museum aanmaken en ID opslaan
- [ ] Minimaal 5 schilderijen toevoegen
- [ ] 2 routes aanmaken voor het museum
- [ ] Route 1: 4 stops toevoegen
- [ ] Route 2: 3 stops toevoegen
- [ ] Museum details ophalen en routes controleren
- [ ] Route details ophalen en stops controleren
- [ ] Route stop sequence number aanpassen
- [ ] Bulk reorder uitvoeren
- [ ] Museum bijwerken
- [ ] Route bijwerken
- [ ] Schilderij bijwerken
- [ ] Route deactiveren
- [ ] Route activeren
- [ ] Route stop verwijderen
- [ ] Error testen: duplicate painting in route
- [ ] Error testen: duplicate sequence number
- [ ] Error testen: painting van ander museum
- [ ] Error testen: museum not found
- [ ] Schilderij verwijderen
- [ ] Route verwijderen
- [ ] Museum verwijderen

---

## 🎯 TWEEDE MUSEUM SCENARIO

Maak een tweede museum aan om cross-museum functionaliteit te testen:

**Museum 2:**
```json
{
  "name": "Van Gogh Museum",
  "address": "Museumplein 6, 1071 DJ Amsterdam",
  "description": "Het Van Gogh Museum herbergt de grootste collectie kunstwerken van Vincent van Gogh.",
  "isActive": true
}
```

**Schilderijen Museum 2:**

```json
{
  "museumId": 2,
  "title": "De Zonnebloemen",
  "artist": "Vincent van Gogh",
  "year": 1889,
  "museumLabel": "S-0031-V-1962",
  "imageRecognitionKey": "vangogh-zonnebloemen-s-0031",
  "infoTitle": "Van Goghs iconische bloemen",
  "infoText": "Een van de beroemdste schilderijen van zonnebloemen",
  "externalLink": "https://www.vangoghmuseum.nl"
}
```

```json
{
  "museumId": 2,
  "title": "De Aardappeleters",
  "artist": "Vincent van Gogh",
  "year": 1885,
  "museumLabel": "S-0005-V-1962",
  "imageRecognitionKey": "vangogh-aardappeleters-s-0005",
  "infoTitle": "Van Goghs eerste meesterwerk",
  "infoText": "Een donker en emotioneel portret van boerenleven",
  "externalLink": "https://www.vangoghmuseum.nl"
}
```

Test vervolgens dat je paintings van museum 2 NIET kunt toevoegen aan routes van museum 1!

---

## ✅ SUCCESS CRITERIA

Je systeem werkt correct als:

1. ✅ Je een museum kunt aanmaken en een ID terugkrijgt
2. ✅ Je meerdere schilderijen aan een museum kunt toevoegen
3. ✅ Je meerdere routes voor een museum kunt aanmaken
4. ✅ Je schilderijen aan routes kunt toevoegen in een specifieke volgorde
5. ✅ Je de volgorde van stops kunt aanpassen (individueel en bulk)
6. ✅ Je musea en routes kunt activeren/deactiveren
7. ✅ Je alles kunt bijwerken (PUT requests)
8. ✅ Je stops, schilderijen, routes en musea kunt verwijderen
9. ✅ Validaties werken (duplicates, verkeerde musea, etc.)
10. ✅ Error messages zijn duidelijk en correct (400, 404, 500)

---

## 🚀 QUICK START SCRIPT

Kopieer en plak dit in je REST client voor een snelle complete setup:

```javascript
// 1. Museum
POST {{baseUrl}}/api/admin/museums
{
  "name": "Test Museum",
  "address": "Test Street 1",
  "description": "Test Description",
  "isActive": true
}

// 2. Painting 1
POST {{baseUrl}}/api/admin/paintings
{
  "museumId": 1,
  "title": "Painting One",
  "artist": "Artist One",
  "year": 2020,
  "museumLabel": "P-001",
  "imageRecognitionKey": "painting-one-key",
  "infoTitle": "Info Title",
  "infoText": "Info Text"
}

// 3. Painting 2
POST {{baseUrl}}/api/admin/paintings
{
  "museumId": 1,
  "title": "Painting Two",
  "artist": "Artist Two",
  "year": 2021,
  "museumLabel": "P-002",
  "imageRecognitionKey": "painting-two-key",
  "infoTitle": "Info Title 2",
  "infoText": "Info Text 2"
}

// 4. Route
POST {{baseUrl}}/api/admin/routes
{
  "museumId": 1,
  "name": "Test Route",
  "description": "Test Route Description",
  "isActive": true
}

// 5. Route Stop 1
POST {{baseUrl}}/api/admin/route-stops/route/1
{
  "paintingId": 1,
  "sequenceNumber": 1
}

// 6. Route Stop 2
POST {{baseUrl}}/api/admin/route-stops/route/1
{
  "paintingId": 2,
  "sequenceNumber": 2
}

// 7. Verify
GET {{baseUrl}}/api/admin/museums/1
```

Succes met testen! 🎉
