var fs = require('fs');
var Lexer = require('./libs/lexer');
var Parser = require('./libs/parser');
var args = process.argv.slice(2);

var filename = args[0];
var source = fs.readFileSync(filename, { encoding: 'utf8' });

var tokens = new Lexer().exec(source);
var descriptiors = new Parser().exec(tokens);

console.log(descriptiors);