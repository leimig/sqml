module.exports = {
    DIGIT:      "DIGIT",
    IDENTIFIER: "IDENTIFIER",
    STRING:     "STRING",
    TIMES:      "TIMES",
    RBRACKETS:  "RBRACKETS",
    LBRACKETS:  "LBRACKETS",
    RPARENS:    "RPARENS",
    LPARENS:    "LPARENS",
    COMMA:      "COMMA",
    COLON:      "COLON",
    SEMICOLON:  "SEMICOLON",

    get: function(str) {
        switch (str) {
            case '*': return this.TIMES;
            case '{': return this.LBRACKETS;
            case '}': return this.RBRACKETS;
            case '(': return this.LPARENS;
            case ')': return this.RPARENS;
            case ',': return this.COMMA;
            case ':': return this.COLON;
            case ';': return this.SEMICOLON;
        }
    }
}