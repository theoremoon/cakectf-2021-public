const express = require("express");
const sqlite3 = require("sqlite3");
const path = require('path');

const app = express();
const db = new sqlite3.Database('database.db');
app.disable('etag');

/**
 * Run SQL statement
 */
function querySqlStatement(stmt) {
    return new Promise((resolve, reject) => {
        db.get(stmt, (err, row) => {
            if (err) reject(err);
            if (row === undefined)
                reject("Not found");
            else
                resolve(row);
        });
    });
}

/**
 * Find neko by name
 */
async function queryNekoByName(neko_name, callback) {
    let filter = /(\'|\\|\s)/g;
    let result = [];
    if (typeof neko_name === 'string') {
        /* Process single query */
        if (filter.exec(neko_name) === null) {
            try {
                let row = await querySqlStatement(
                    `SELECT * FROM neko WHERE name='${neko_name}'`
                );
                if (row) result.push(row);
            } catch { }
        }
    } else {
        /* Process multiple queries */
        for (let name of neko_name) {
            if (filter.exec(name.toString()) === null) {
                try {
                    let row = await querySqlStatement(
                        `SELECT * FROM neko WHERE name='${name}'`
                    );
                    if (row) result.push(row);
                } catch { }
            }
        }
    }
    callback(result);
}

/**
 * Find neko by My Nyamber
 */
async function queryNekoById(neko_id, callback) {
    let nid = parseInt(neko_id);
    if (!isNaN(nid)) {
        try {
            let row = await querySqlStatement(
                `SELECT * FROM neko WHERE nid=${nid}`
            );
            if (row) {
                callback([row]);
                return;
            }
        } catch { }
    }

    /* Invalid ID or result not found */
    callback([]);
}

app.use(express.static(path.join(__dirname, 'public')))

app.get("/api/neko", function(req, res, next) {
    if (req.query.id == null && req.query.name == null) {
        /* Missing required parameters */
        res.status(400);
        res.json({reason: 'My Nyamber is not set'});
    } else {
        try {
            if (req.query.id) {
                /* Find by My Nyamber */
                queryNekoById(req.query.id,
                              result => { res.json({result}); });
            } else {
                /* Find by name */
                queryNekoByName(req.query.name,
                                result => { res.json({result}); });
            }
        } catch (e) {
            res.status(500);
            res.json({reason: 'SQL query failed :cry:'});
        }
    }
});

app.listen(8080);
