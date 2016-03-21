module.exports = {
    DIGIT:            "DIGIT",
    IDENTIFIER:       "IDENTIFIER",
    STRING:           "STRING",
    QUERY:            "QUERY",
    TIMES:            "TIMES",
    RBRACKETS:        "RBRACKETS",
    LBRACKETS:        "LBRACKETS",
    LSQUARE_BRACKETS: "LSQUARE_BRACKETS",
    RSQUARE_BRACKETS: "RSQUARE_BRACKETS",
    RPARENS:          "RPARENS",
    LPARENS:          "LPARENS",
    COMMA:            "COMMA",
    COLON:            "COLON",
    SEMICOLON:        "SEMICOLON",

    get: function(str) {
        switch (str) {
            case '*': return this.TIMES;
            case '{': return this.LBRACKETS;
            case '}': return this.RBRACKETS;
            case '[': return this.LSQUARE_BRACKETS;
            case ']': return this.RSQUARE_BRACKETS;
            case '(': return this.LPARENS;
            case ')': return this.RPARENS;
            case ',': return this.COMMA;
            case ':': return this.COLON;
            case ';': return this.SEMICOLON;
        }
    },

    isDataType: function(token) {
        switch (token) {
            case this.DIGIT:
            case this.STRING:
                return true;
            default:
                return false;
        }
    }
}