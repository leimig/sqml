var uuid   = require('node-uuid');
var moment = require('moment');

function Bag() {
    this.sequences = {};
}

Bag.prototype.get = function(name, args) {
    var value = this[name].apply(this, args);

    // Prepares strings to be inserted into the SQL
    if (typeof value === 'string') {
        value = "'" + value + "'";
    }

    return value;
}

Bag.prototype.uuid = function(version) {
    return uuid[version || 'v4']();
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
    days    = days    || 0; // default value
    months  = months  || 0; // default value
    years   = years   || 0; // default value
    hours   = hours   || 0; // default value
    minutes = minutes || 0; // default value
    seconds = seconds || 0; // default value

    var date = new Date();

    date.setDate(date.getDate() + days);
    date.setMonth(date.getMonth() + months);
    date.setFullYear(date.getFullYear() + years);

    date.setHours(date.getHours() + hours);
    date.setMinutes(date.getMinutes() + minutes);
    date.setSeconds(date.getSeconds() + seconds);

    return moment(date).format(DATE_FORMAT);
};

module.exports = new Bag();