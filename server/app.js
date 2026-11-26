const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("node:path");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../client")));

const games = new Map();

let ID = 0;

let record = {
    name: "",
    kills: 0
};

// Mostri disponibili
const MONSTERS = [
    { name: "Slime", maxHp: 30, minDamage: 5, maxDamage: 9 },
    { name: "Goblin", maxHp: 50, minDamage: 8, maxDamage: 13 },
    { name: "Orco", maxHp: 70, minDamage: 11, maxDamage: 17 }
];

// Recupera la partita attraverso il cookie
function getGame(req, res) {
    const game = games.get(req.cookies.gameId);

    if (!game) {
        res.status(404).json({ error: "Game not found" });
        return null;
    }

    return game;
}

// Prepara l'oggetto JSON da restituire al client
function getGameState(game) {
    return {
        name: game.name,
        hp: game.hp,
        maxHp: game.maxHp,
        mana: game.mana,
        maxMana: game.maxMana,
        kills: game.kills,
        status: game.status,
        monster: {
            name: game.monster.name,
            hp: game.monster.hp,
            maxHp: game.monster.maxHp
        },
        message: game.message
    };
}

app.post("/start", (req, res) => {

    const name = req.name;

    if (!name) {
        return res.status(400).json({ error: "Invalid name" });
    }

    const id = ID ++;
    globalThis.ID = id;

    // Crea lo stato iniziale
    const game = {
        name: name,
        hp: 100,
        maxHp: 100,
        mana: 60,
        maxMana: 60,
        kills: 0,
        status: "playing",
        monster: MONSTERS[Math.floor(Math.random() * MONSTERS.length)],
        message: "La partita è iniziata."
    };
});

app.get("/state", (req, res) => {

    const game = getGame(req, res);
    if (!game) return;

    res.json(getGameState(game));
});

////////////////////////////////////////////////////////
/*qui va la famosa logica di gioco:
- prima vanno inserite le funzioni che compiono le modifiche
- in caso vanno aggiunti degli handler
- infine vanno scritti degli endpoint minimali che chiamino le funzioni suddette*/
////////////////////////////////////////////////////////

app.get("/record", (req, res) => {
    res.json(record);
});


// Avvia il server
app.listen(port, () => {
    console.log(`Server in ascolto su http://localhost:${port}`);
});