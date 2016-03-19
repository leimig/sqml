var Tokens = require('./tokens');

// Lexer definition
function Lexer() {

}

Lexer.prototype.exec = function(source) {
    var ret = [];
    var pos = 0;

    next = function() {
        return source[pos++];
    }

    peek = function() {
        return source[pos];
    }

    // go all the way through the `source` input
    while (pos < source.length) {
        var str = next();

        if (/[\n\r\t ]/i.test(str))
            continue; // if whitespace/line break/tab

        // Looks for an inline comment
        if (str === '/') {
            if ((str = next()) === '/') {
                // Found it. Now, let's ignore the rest of the line
                while ((str = next()) != '\n');
                continue;
            }
        }

        // Check for reserved symbols
        if (token = Tokens.get(str)) {
            ret.push({ type: token });
            continue;
        }

        // Check if it's a string
        if (str === '\'' || str === '\"') {
            var delimiter = str;
            var content = "";

            while ((str = next()) !== delimiter)
                content += str;

            ret.push({
                type: Tokens.STRING,
                value: content
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
                value: identifier
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
                value: digit
            });

            continue;
        }

        // TODO: Improve this error message with line and column instead of index
        throw Error('Unexpected character ' + str + ' at position ' + pos);
        return;
    }

    return ret;
};

module.exports = Lexer;