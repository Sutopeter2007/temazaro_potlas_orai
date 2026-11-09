1. Listázza ki az összes terméket úgy, hogy minden elemnél szerepeljen a hozzá tartozó kategória szöveges megnevezése is, ár szerint
növekvő sorrendbe rendezve!

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


Csak azokat a termékeket adja vissza, amelyek elérhető státuszúak ÉS ténylegesen van is belőlük raktáron (a darabszám nagyobb
nullánál)!

SELECT *
            FROM termekek
            WHERE elerheto = 1 AND keszlet > 0
        

Részletkeresés: adja vissza azokat a termékeket, amelyek nevében bármilyen pozícióban előfordul az útvonalban megadott
szövegrészlet!

"SELECT * FROM termekek WHERE nev LIKE ?",
            [`%${szoveg}%`]


Készítsen kategóriánkénti összegzést: jelenjen meg a kategória neve, az alá tartozó termékek darabszáma, valamint azok kerekített
átlagos ára!


              SELECT
                kategoriak.nev AS kategoria_nev,
                COUNT(termekek.id) AS termekek_szama,
                ROUND(AVG(termekek.ar), 1) AS atlagos_ar
            FROM kategoriak
            INNER JOIN termekek
            ON kategoriak.id = termekek.kategoria_id
            GROUP BY kategoriak.id, kategoriak.nev


Válassza ki a 10 000 Ft feletti termékek nevét, egységárát és készletét, raktárkészlet szerint csökkenő sorrendbe állítva az adatokat!

 SELECT nev, ar, keszlet
            FROM termekek
            WHERE ar > 10000
            ORDER BY keszlet DESC

