var fs        = require('fs'),
    Lexer     = require('./libs/lexer'),
    Parser    = require('./libs/parser'),
    Assembler = require('./libs/assembler'),
    args      = process.argv.slice(2);

var filename = args[0];
var source   = fs.readFileSync(filename, { encoding: 'utf8' });

var tokens      = new Lexer().exec(source);
var descriptors = new Parser().exec(tokens);
var queries     = new Assembler().exec(descriptors);

console.log(queries);