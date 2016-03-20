var fs        = require('fs'),
    Lexer     = require('./libs/lexer'),
    Parser    = require('./libs/parser'),
    Assembler = require('./libs/assembler'),
    args      = process.argv.slice(2);

var source   = args[0];
var target   = args[1];

if (!source) {
    console.log('ERROR: missing input file!');
    process.exit(-1);
}

if (!target) {
    console.log('ERROR: missing output file!');
    process.exit(-1);
}

try {
    console.log('Reading input file ' + source);
    var input = fs.readFileSync(source, { encoding: 'utf8' });

    console.log('Starting compilation...');
    var tokens      = new Lexer().exec(input);
    var descriptors = new Parser().exec(tokens);

    console.log('Assembling queries...');
    var queries     = new Assembler().exec(descriptors);

    // TODO: Transactions
    // var data  = "BEGIN TRANSACTION;\n";
    //     data += queries.join('\n');
    //     data += "\nCOMMIT;"

    console.log('Writing result data into ' + target);
    fs.writeFileSync(target, queries.join('\n'), { encoding: 'utf8' });

} catch (e) {
    console.log('ERROR: ' + e.message);
    process.exit(-1);
}

console.log('All done!');