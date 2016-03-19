var fs = require('fs');
var Lexer = require('./libs/lexer');
var args = process.argv.slice(2);

var filename = args[0];
var source = fs.readFileSync(filename, { encoding: 'utf8' });

var tokens = new Lexer().exec(source);

console.log(tokens);