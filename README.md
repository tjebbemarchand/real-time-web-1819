# Real Time Web

## Chat App uitbreiding
[Live link chat app](https://chat-app-tjebbe.herokuapp.com)

### Aanpassingen
1. Ik heb een functie toegevoegd die je tekst bericht omzet naar de positie van de letter van het alfabet. Dus de "a" wordt een 1, "b" wordt een 2 etc.
Als je bijvoorbeeld "appel" intikt, krijg je het volgende als resultaat: 1-16-16-5-12. Alle cijfers worden afgevangen door er blokhaken eromheen te zetten. Als je een 1 intikt, dan wordt dat [1], zodat je nog wel ziet dat het een cijfer is. En alle tekens blijven je zien.

2. Er is de mogelijkheid toevoegd dat je een eigen gebruiksnaam kan invullen voordat je kunt chatten.

3. Ik heb een broadcast toegevoegd die laat weten aan andere gebruikers als iemand aan het typen is.

### Toegevoegde waarden
Ik heb deze functies toegevoegd om te oefenen met websockets.


## Real Time Application
### Concept
Ik haal data op van de populaire films van dit moment. Deze worden allemaal getoond op de webpagina. Hier kun je filteren op verschillende genres en doorklikken naar een detailpagina.
Op de detailpagina kun je alle informatie zien over die specifieke film met afbeeldingen en een trailer.
Op de overzichtpagina staat er ook een grafiek te staan met de verschillende genres. Zo kun je snel zien welke genres het populairst zijn deze week.

### API
[The Movie DB](https://developers.themoviedb.org/3/getting-started/introduction)
Ik maak gebruik van de TMDb API. Dit is geen real time api, maar ik haal de datum 2x keer per dag op zodat de pagina wel blijft veranderen.