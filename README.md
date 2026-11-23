# Monster Arena

Realizzare un gioco a turni in cui un giocatore affronta una sequenza di mostri casuali, cercando di sconfiggerne il maggior numero possibile prima di morire.

L'applicazione deve utilizzare HTML, CSS e JavaScript per il client e Node.js con Express per il server. Il client comunica con il server tramite `fetch()` e richieste HTTP.

## 1. Regole del gioco

Il giocatore inizia con:

- 100 HP (punti vita)
- 60 MP (punti mana)
- 0 mostri sconfitti

Ad ogni turno può eseguire una delle seguenti azioni:

| Azione | Effetto |
|---|---|
| Attacco | Infligge 10-18 danni e recupera 5 MP |
| Magia | Infligge 25-35 danni e consuma 15 MP |
| Cura | Recupera 25-35 HP e consuma 20 MP |

Gli HP non possono superare 100 e gli MP non possono superare 60. Magia e cura non sono disponibili quando il mana è insufficiente.

Dopo ogni azione valida, se il mostro è ancora vivo, contrattacca infliggendo danni al giocatore.

I mostri disponibili sono:

| Mostro | HP | Danno |
|---|---|---|
| Slime | 30 | 5-9 |
| Goblin | 50 | 8-13 |
| Orc | 70 | 11-17 |

All'inizio della partita viene estratto un mostro casuale. Quando viene sconfitto:

- Il punteggio aumenta di 1.
- Il giocatore recupera 10 MP.
- Viene estratto un nuovo mostro casuale, anche dello stesso tipo.

La partita continua finché gli HP del giocatore arrivano a zero.

Il server conserva il record globale, composto dal nome del giocatore e dal massimo numero di mostri sconfitti. Il record viene aggiornato quando una partita supera il risultato precedente.

## 2. Organizzazione del progetto

```text
monster-arena/
├── package.json
├── client/
│   ├── index.html
│   ├── game.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── index.js
│       └── game.js
└── server/
    └── app.js
```

Il server Express deve distribuire i file della cartella `client` tramite `express.static()`.

Sono sufficienti le dipendenze `express` e `cookie-parser`. Non sono richiesti database o altri framework.

## 3. Interfaccia

Realizzare due pagine.

**index.html**

- Mostra il titolo del gioco e il record globale.
- Permette di inserire il nome del giocatore.
- Contiene un pulsante per iniziare una nuova partita.
- Se esiste una partita ancora attiva, apre automaticamente `game.html`.

**game.html**

- Mostra il nome del giocatore e il numero di mostri sconfitti.
- Mostra HP e MP del giocatore con barre `<progress>`.
- Mostra il nome e gli HP del mostro corrente.
- Contiene tre pulsanti: Attacco, Magia e Cura.
- Mostra il risultato dell'ultima azione.
- Mostra il record globale.
- Quando il giocatore muore, mostra il punteggio finale e permette di iniziare una nuova partita.

L'interfaccia deve aggiornarsi dopo ogni azione senza ricaricare la pagina.

## 4. Endpoint HTTP

Il server deve implementare i seguenti endpoint:

| Metodo | URL | Funzione |
|---|---|---|
| POST | `/start` | Crea una nuova partita |
| GET | `/state` | Restituisce la partita corrente |
| POST | `/attack` | Esegue un attacco normale |
| POST | `/magic` | Esegue un attacco magico |
| POST | `/heal` | Cura il giocatore |
| GET | `/record` | Restituisce il record globale |

### Creazione della partita

Il client invia:

```javascript
fetch("/start", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ name: "Mario" })
});
```

Il server crea lo stato iniziale della partita, genera un identificativo e lo salva in un cookie chiamato `gameId`.

### Stato della partita

`GET /state` restituisce un JSON con questa struttura:

```json
{
  "name": "Mario",
  "hp": 85,
  "maxHp": 100,
  "mana": 40,
  "maxMana": 60,
  "kills": 2,
  "status": "playing",
  "monster": {
    "name": "Goblin",
    "hp": 30,
    "maxHp": 50
  },
  "message": "Il Goblin ti colpisce per 10 danni."
}
```

Lo stato può essere `playing` oppure `lost`.

Se non esiste una partita associata al cookie, il server restituisce un errore `404`.

### Azioni

Per eseguire un'azione, il client invia una richiesta POST all'endpoint corrispondente.

Esempio:

```javascript
const response = await fetch("/attack", {
  method: "POST"
});

const game = await response.json();
```

Il server:

1. Recupera la partita associata al cookie.
2. Applica l'azione richiesta.
3. Esegue l'eventuale contrattacco del mostro.
4. Aggiorna la partita.
5. Restituisce lo stato aggiornato con la stessa struttura di `/state`.

Le azioni non valide, ad esempio una magia senza mana sufficiente, non devono modificare la partita e devono restituire un errore.

### Record

`GET /record` restituisce:

```json
{
  "name": "Alice",
  "kills": 12
}
```

Se nessuno ha ancora stabilito un record, il server può restituire un nome vuoto e `kills` uguale a zero.

## 5. Gestione delle partite

Il server deve supportare più giocatori contemporaneamente.

Utilizzare una `Map` per memorizzare le partite, ciascuna associata a un identificativo univoco.

Utilizzare `cookie-parser` per recuperare l'identificativo della partita dal cookie `gameId`.

Il browser conserva il cookie e lo invia automaticamente nelle successive richieste allo stesso server. In questo modo il giocatore può ricaricare la pagina senza perdere i progressi.

Partite e record rimangono in memoria e vengono persi al riavvio del server.

## 6. Prova finale

Avviare il server e verificare che:

- Si possano creare nuove partite.
- Attacco, magia e cura rispettino le regole.
- I mostri vengano estratti casualmente.
- La partita termini quando il giocatore muore.
- Il record venga aggiornato correttamente.
- Ricaricando la pagina si possa riprendere la partita.
- Più browser possano giocare contemporaneamente con partite indipendenti.

Per collegarsi al server di un altro computer della rete locale, aprire nel browser:

```text
http://IP_DEL_SERVER:3000
```
