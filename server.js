
const express = require("express");
const mysql = require("mysql2/promise");

const app = express();

app.use(express.json());

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "raktar_db",
    port: 3307
});

app.get("/termekek", async (req, res) => {
    try {
        const [eredmeny] = await db.query(`
            SELECT 
                termekek.id,
                termekek.nev,
                termekek.ar,
                termekek.keszlet,
                termekek.elerheto,
                kategoriak.nev AS kategoria_nev
            FROM termekek
            INNER JOIN kategoriak
            ON termekek.kategoria_id = kategoriak.id
            ORDER BY termekek.ar ASC
        `);

        res.json(eredmeny);
    } catch (error) {
        res.status(500).json({ hiba: error.message });
    }
});

app.get("/termekek/elerheto", async (req, res) => {
    try {
        const [eredmeny] = await db.query(`
            SELECT *
            FROM termekek
            WHERE elerheto = 1 AND keszlet > 0
        `);

        res.json(eredmeny);
    } catch (error) {
        res.status(500).json({ hiba: error.message });
    }
});

app.get("/termekek/kereses/:szoveg", async (req, res) => {
    try {
        const szoveg = req.params.szoveg;

        const [eredmeny] = await db.query(
            "SELECT * FROM termekek WHERE nev LIKE ?",
            [`%${szoveg}%`]
        );

        res.json(eredmeny);
    } catch (error) {
        res.status(500).json({ hiba: error.message });
    }
});

app.get("/kategoriak/statisztika", async (req, res) => {
    try {
        const [eredmeny] = await db.query(`
            SELECT
                kategoriak.nev AS kategoria_nev,
                COUNT(termekek.id) AS termekek_szama,
                ROUND(AVG(termekek.ar), 1) AS atlagos_ar
            FROM kategoriak
            INNER JOIN termekek
            ON kategoriak.id = termekek.kategoria_id
            GROUP BY kategoriak.id, kategoriak.nev
        `);

        res.json(eredmeny);
    } catch (error) {
        res.status(500).json({ hiba: error.message });
    }
});

app.get("/termekek/dragak", async (req, res) => {
    try {
        const [eredmeny] = await db.query(`
            SELECT nev, ar, keszlet
            FROM termekek
            WHERE ar > 10000
            ORDER BY keszlet DESC
        `);

        res.json(eredmeny);
    } catch (error) {
        res.status(500).json({ hiba: error.message });
    }
});

app.listen(3000, () => {
    console.log("Szerver fut a 3000-es porton!");
});
