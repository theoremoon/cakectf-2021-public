const sqlite3 = require('sqlite3');
const flag = process.env.flag || "CakeCTF{**** TEST FLAG *****}";

const db = new sqlite3.Database('database.db');

db.serialize(function() {
    let random_nid = () => Math.floor(Math.random() * 100000000);

    /* Create neko table */
    db.run("CREATE TABLE IF NOT EXISTS neko(nid INTEGER, species TEXT, name TEXT, age INTEGER)");
    db.run("INSERT INTO neko VALUES (22222222, 'American Shorthair', 'Nyanta', 4)");
    db.run("INSERT INTO neko VALUES (" + random_nid() + ", 'Scottish Fold', 'Nyanko', 12)");
    db.run("INSERT INTO neko VALUES (" + random_nid() + ", 'Norwegian Forest Cat', 'Nyanyami', 7)");
    db.run("INSERT INTO neko VALUES (" + random_nid() + ", 'Pallas''s Cat', 'Nyappy', 8)");
    db.run("INSERT INTO neko VALUES (" + random_nid() + ", 'Caracal', 'Nyamuro', 1)");
    db.run("INSERT INTO neko VALUES (" + random_nid() + ", 'Bengal Cat', 'Nyanchu', 98)");

    /* Create flag table */
    db.run("CREATE TABLE IF NOT EXISTS flag(flag TEXT)");
    db.run("INSERT INTO flag VALUES ('" + flag + "')");
});

db.close();
