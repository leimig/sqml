var Tokens = require('./tokens');

// Parser definition
function Parser() {

}

Parser.prototype.exec = function(tokens) {
    var ret = [];
    var pos = 0;

    next = function() {
        return tokens[pos++];
    }

    peek = function() {
        return tokens[pos];
    }

    validate = function(actual, expected) {
        if (!actual)
            throwMissingToken(expected);
        else if(actual.type !== expected)
            throwUnexpectedToken(token);
    }

    parseArgument = function(token, notNull) {
        // Check if it's a method
        if (token.type === Tokens.IDENTIFIER) {
            return parseMethod(token);

        // or if it's a data type
        } else if (Tokens.isDataType(token.type)) {
            return token.value;

        } else { // otherwise, it's an error
            if (notNull)
                throwUnexpectedToken(token);
        }
    }

    parseMethod = function(token) {
        var method = { name: token.value, args: [] };

        // Check for parens
        validate(next(), Tokens.LPARENS);

        while (peek().type !== Tokens.RPARENS) {
            if (arg = parseArgument(next())) {
                method.args.push(arg);
            }
        }

        // Check for parens
        validate(next(), Tokens.RPARENS);

        return method;
    }

    throwMissingToken = function(token) {
        throw Error('Missing token ' + token);
    }

    throwUnexpectedToken = function(token) {
        throw Error('Unexpected token of type ' + token.type + ' ' + token.value);
    }

    while (pos < tokens.length) {
        var descriptor = { properties: [] };
        var token = next();

        // Check table name
        if (token.type === Tokens.IDENTIFIER) {
            descriptor.table = token.value;

            // Check for brackets
            validate(token = next(), Tokens.LBRACKETS);

            while (true) {
                if (peek().type === Tokens.RBRACKETS)
                    break; // end of the properties

                var property = {};

                // Get property name
                validate(token = next(), Tokens.IDENTIFIER);
                property.name = token.value;

                // Check for colon
                validate(token = next(), Tokens.COLON);

                property.value = parseArgument(token = next(), true);

                descriptor.properties.push(property);

                if (peek().type === Tokens.COMMA)
                    next(); // ignores commas
            }

            // Check for brackets
            validate(token = next(), Tokens.RBRACKETS);

            // Check for a quantity limit
            if (peek().type === Tokens.TIMES) {
                next(); // discart times symbol

                // Check for brackets
                validate(token = next(), Tokens.DIGIT);

                descriptor.quantity = parseInt(token.value);
            }

            // Check for brackets
            validate(token = next(), Tokens.SEMICOLON);

            ret.push(descriptor);
        }
    }

    return ret;
};

module.exports = Parser;