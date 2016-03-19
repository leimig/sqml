var uuid   = require('node-uuid');
var moment = require('moment');

function Bag() {
    this.sequences = {};
}

Bag.prototype.get = function(name, args) {
    var argsv = [];

    args.forEach(function(arg, index) {
        if (typeof arg === 'object') {
            argsv[index] = this.get(arg.name, arg.args);
        } else {
            argsv[index] = arg;
        }
    }.bind(this));

    var value = this[name].apply(this, argsv);

    // Prepares strings to be inserted into the SQL
    if (typeof value === 'string') {
        value = "'" + value + "'";
    }

    return value;
}

Bag.prototype.uuid = function(version) {
    return uuid[version || 'v1']();
};

Bag.prototype.sequence = function(id, startAt) {
    this.sequences[id] = this.sequences[id] || startAt;
    return this.sequences[id]++;
};

Bag.prototype.random = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

Bag.prototype.date = function() {
    var date = moment.apply(this, arguments);
    return date.toISOString();
};

Bag.prototype.relativeDate = function(days, months, years, hours, minutes, seconds) {
    var date = moment();

    date.add(days    || 0, 'd');
    date.add(months  || 0, 'M');
    date.add(years   || 0, 'y');
    date.add(hours   || 0, 'h');
    date.add(minutes || 0, 'm');
    date.add(seconds || 0, 's');

    return date.toISOString();
};

module.exports = new Bag();