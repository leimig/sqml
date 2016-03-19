var tokens = require('./tokens');

// My module
function Lexer() {
  this.tokens = tokens;
}

Lexer.prototype.exec = function(source) {

};

module.exports = Lexer;