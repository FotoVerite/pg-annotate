'use strict';

function toDash(string) {
    return string.replace(/([A-Z])/g, function($1) {
        return '_' + $1.toLowerCase();
    });
}

// right padding s with c to a total of n chars
function paddingRight(s, c, n) {
    if (!s || !c || s.length >= n) {
        return s;
    }

    var max = (n - s.length) / c.length;
    for (var i = 0; i < max; i++) {
        s += c;
    }

    return s;
}

function createPrependString(commentToken, rows) {
    var string = '';
    string += commentToken + ' == Schema Information\n';
    string += commentToken + '\n';
    rows.forEach(function(column) {
        string += commentToken;
        string += paddingRight(column.column_name, ' ', 20);
        string += ' ';
        string += paddingRight(column.data_type, ' ', 30);
        string += ' ';
        string += column.column_default;
        string += '\n';
    });
    string += commentToken + '\n';
    return string;
}

function sanitizeFileName(fileName) {
    fileName = fileName.replace(/get_/, '');
    fileName = fileName.replace(/create_/, '');
    return fileName;
}

var utils = {
  toDash: toDash,
  paddingRight: paddingRight,
  createPrependString: createPrependString,
  sanitizeFileName: sanitizeFileName
};

module.exports = utils;
