var Tokens = require('./tokens');

// Lexer definition
function Lexer() {

}

Lexer.prototype.exec = function(source) {
    var ret = [];
    var pos = 0;
    var line = 1;
    var column = 0;

    next = function() {
        column++;
        return source[pos++];
    }

    peek = function() {
        return source[pos];
    }

    // go all the way through the `source` input
    while (pos < source.length) {
        var str = next();

        if (/[\n\r\t ]/i.test(str)) {
            if (str === '\n') {
                column = 0;
                line++;
            }

            continue; // if whitespace/line break/tab
        }

        // Looks for an inline comment
        if (str === '/') {
            if ((str = next()) === '/') {
                // Found it. Now, let's ignore the rest of the line
                while ((str = next()) != '\n');
                column = 0;
                line++;

                continue;
            }
        }

        // Check for reserved symbols
        if (token = Tokens.get(str)) {
            ret.push({
                type: token,
                line: line,
                column: column
            });
            continue;
        }

        // Check if it's a string
        if (str === '\'' || str === '\"') {
            var delimiter = str;
            var content = "";

            // Looks for all the characters inside de string
            while ((str = next()) !== delimiter) {
                if (str === '\\') {
                    str += next();
                }

                content += str;
            }

            ret.push({
                type: Tokens.STRING,
                value: content,
                line: line,
                // subtracting the length and adding the quotes
                // will mark the begining of the string
                column: column - (content.length - 1 + 2 /* for the quotes*/)
            });

            continue;
        }

        // Check for identifiers
        if (/[a-zA-Z_]/i.test(str)) {
            var identifier = str;
            while (/[a-zA-Z_0-9]/i.test(peek()))
                identifier += (str = next());

            ret.push({
                type: Tokens.IDENTIFIER,
                value: identifier,
                line: line,
                // subtracting the length will mark the begining of the identifier
                column: column - (identifier.length - 1)
            });

            continue;
        }

        // Check for numbers
        if (/[0-9\-\+]/i.test(str)) {
            var digit = str;
            while (/[0-9\.]/i.test(peek()))
                digit += (str = next());

            ret.push({
                type: Tokens.DIGIT,
                value: parseFloat(digit),
                line: line,
                // subtracting the length will mark the begining of the number
                column: column - (digit.length - 1)
            });

            continue;
        }

        throw SyntaxError('Unexpected character `' + str + '` at ' + line + ':' + column);
    }

    return ret;
};

module.exports = Lexer;