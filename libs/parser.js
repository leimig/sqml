var Tokens = require('./tokens');

// Parser definition
function Parser(tokens) {
    this.tokens = tokens;
    this.pos = 0;
}

Parser.prototype.exec = function(tokens) {
    var ret = [];
    this.pos = 0;
    this.tokens = tokens;

    while (this.pos < this.tokens.length) {
        var descriptor = { properties: [] };
        var token = this._next();

        // Check table name
        if (token.type === Tokens.IDENTIFIER) {
            descriptor.table = token.value;

            // Check for brackets
            this._validate(token = this._next(), Tokens.LBRACKETS);

            while (true) {
                if (this._peek().type === Tokens.RBRACKETS)
                    break; // end of the properties

                var property = {};

                // Get property name
                this._validate(token = this._next(), Tokens.IDENTIFIER);
                property.name = token.value;

                // Check for colon
                this._validate(token = this._next(), Tokens.COLON);

                property.value = this._parseArgument(token = this._next(), true);

                descriptor.properties.push(property);

                if (this._peek().type === Tokens.COMMA)
                    this._next(); // ignores commas
            }

            // Check for brackets
            this._validate(token = this._next(), Tokens.RBRACKETS);

            // Check for a quantity limit
            if (this._peek().type === Tokens.TIMES) {
                this._next(); // discart times symbol

                // Check for brackets
                this._validate(token = this._next(), Tokens.DIGIT);

                descriptor.quantity = parseInt(token.value);
            } else {
                // Default quantity value
                descriptor.quantity = 1;
            }

            // Check for semicolon
            this._validate(token = this._next(), Tokens.SEMICOLON);

            ret.push(descriptor);
            continue;
        }

        this._throwUnexpectedToken(token);
    }

    return ret;
};

Parser.prototype._next = function() {
    return this.tokens[this.pos++];
}

Parser.prototype._peek = function() {
    return this.tokens[this.pos];
}

Parser.prototype._validate = function(actual, expected) {
    if(actual.type !== expected)
        this._throwUnexpectedToken(token);
};

Parser.prototype._parseArgument = function(token, notNull) {
    // Check if it's a method
    if (token.type === Tokens.IDENTIFIER) {
        return this._parseMethod(token);

    // Check if it's a query
    } else if (token.type === Tokens.QUERY) {
        return this._parseQuery(token);

    // or if it's a data type
    } else if (Tokens.isDataType(token.type)) {
        return token.value;

    } else { // otherwise, it's an error
        if (notNull)
            this._throwUnexpectedToken(token);
    }
}

Parser.prototype._parseMethod = function(token) {
    var method = {
        type: 'method',
        name: token.value,
        args: []
    };

    // Check for parens
    this._validate(this._next(), Tokens.LPARENS);

    while (this._peek().type !== Tokens.RPARENS) {
        var arg = this._parseArgument(this._next());

        // Ignores only undefined and nulls
        if (arg !== null && arg !== void 0) {
            method.args.push(arg);
        }
    }

    // Check for parens
    this._validate(this._next(), Tokens.RPARENS);

    return method;
};

Parser.prototype._parseQuery = function(token) {
    var query = {
        type: 'query',
        query: token.value,
        args: []
    };

    if (this._peek().type === Tokens.LSQUARE_BRACKETS) {
        this._next(); // ignores left bracket

        while (this._peek().type !== Tokens.RSQUARE_BRACKETS) {
            var value = this._parseArgument(this._next());
            query.args.push(value);

            if (this._peek().type === Tokens.COMMA)
                this._next(); // ignores comma
        }

        this._next(); // ignores right bracket
    }

    return query;
};

Parser.prototype._throwUnexpectedToken = function(token) {
    if (token.value)
        errorMessage = 'Unexpected token `' + token.value + '`';
    else
        errorMessage = 'Unexpected token of type ' + token.type;

    throw Error(errorMessage + ' at ' + token.line + ':' + token.column);
};

module.exports = Parser;