const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
const port = 3000;

app.use(express.json()); //per leggere i json inviati dal client
app.use(cookieParser());
path.join(__dirname, "../client");

const STATUS = ["playing", "lost"];

const games = new Map();

let record = {
    name: "",
    kills: 0
};

//Start
fetch("/start", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ name: "" })
});

//State
app.get("/state", (req, res) => {
    let status = req.query.status;

    if (!STATUS.includes(status))
        return res.status(404).json({ error: "Invalid status" });

    res.json({
        "name": "",
        "hp": 0,
        "maxHp": 0,
        "mana": 0,
        "maxMana": 0,
        "kills": 0,
        "status": status,
        "monster": {},
        "message": ""
    });
});

//Actions

//Record
app.get("/record", (req, res) => {
    if (req.query.kills > kills)
        kills = req.query.kills;

    res.json({
        "name": "",
        "kills": 0
    });
});

app.listen(port, () => {
    console.log("Server in ascolto su http://localhost:" + port);
});
