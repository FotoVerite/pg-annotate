'use strict';
var fs = require('fs'),
    colors = require('colors'),
    path = require('path'),
    join = require('path').join,
    pf = require('./lib/pf'),
    pluralize = require('pluralize'),
    pg = require('pg.js'),
    utils = require('./lib/utils');

function queryPG(database, tableName, cb) {
    pg.connect(database, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT column_name, data_type, column_default FROM information_schema.columns WHERE table_name = $1', [tableName], function(err, result) {
            //call `done()` to release the client back to the pool
            cb(result.rows);
            done();

            if (err) {
                return console.error('error running query', err);
            }
        });
    });
}

function annotate(opts, filePath, tableName, dataBaseConf) {
    var ext = path.extname(filePath);
    var commentToken = ext === '.sql' ? '-- ' : '//';
    var baseFileName = path.basename(filePath, ext);
    if(! tableName) {
        tableName = pluralize(utils.sanitizeFileName(utils.toDash(baseFileName)));
    }
    queryPG(dataBaseConf, tableName, function(columns) {
        var annotation = utils.createPrependString(commentToken, columns);
        pf(filePath, annotation, function(done) {
            if (done) {
                console.log(colors.green('Data prepended!'));
                process.exit();
            } else {
                process.exit();
            }
        });

    });

}

module.exports = annotate;
