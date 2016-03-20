var uuid   = require('node-uuid');
var moment = require('moment');

/**
 * Helper is an object with an extensive list of
 * helper methods that generates random, but meaningful, data.
 */
function Helper() {
    this.sequences = {};
}

/**
 * This method is the entry point of the Helper object.
 * It executes the helper methods and returns the calculated
 * value into SQL friendly format.
 *
 * @param  {String} name The name of the method to be executed
 * @param  {Array} args The parameters that will be used by the target method
 * @return {String|Number}
 */
Helper.prototype.get = function(name, args) {
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

/**
 * Generates an UUID based on `version`.
 *
 * @param  {String} version The version of the UUID. It supports `v1` and `v4`
 * @return {String}
 */
Helper.prototype.uuid = function(version) {
    return uuid[version || 'v1']();
};

/**
 * Returns the next integer value of the sequence identified
 * by the `id`. An integer value can also be used to define
 * the first value of the sequence.
 *
 * @param  {String}  id       The name of the sequence
 * @param  {Integer} startsAt The first value of the sequence
 * @return {Integer}
 */
Helper.prototype.sequence = function(id, startsAt) {
    startsAt = startsAt === void 0 ? 0 : startsAt;
    this.sequences[id] = this.sequences[id] || startsAt;
    return this.sequences[id]++;
};

/**
 * Returns a random integer number between `min` and `max`.
 * Both limits are inclusive.
 *
 * @param  {Integer} min  Lower value acceptable by the callee
 * @param  {Integer} max  Higher value acceptable by the callee
 * @return {Integer}      A number between `min` and `max`
 */
Helper.prototype.random = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * This method is an alias to moment.js constructor.
 * It returns the created date as an ISO String.
 *
 * For more information in how to use it, please refer to
 * moment.js docs.
 *
 * http://momentjs.com/docs/#/parsing/
 *
 * @return {String} A Date in ISO String format.
 */
Helper.prototype.date = function() {
    var date = moment.apply(this, arguments);
    return date.toISOString();
};

/**
 * This method is another helper that deals with dates,
 * but instead of creating an exact Date, it creates a Date
 * based on `new Date()` and the supplied parameters.
 *
 * @param  {Integer} days    Days from today.
 * @param  {Integer} months  Months from today.
 * @param  {Integer} years   Years from today.
 * @param  {Integer} hours   Hours from now.
 * @param  {Integer} minutes Minutes from now.
 * @param  {Integer} seconds Seconds from now.
 *
 * @return {String} A Date in ISO String format.
 */
Helper.prototype.relativeDate = function(days, months, years, hours, minutes, seconds) {
    var date = moment();

    date.add(days    || 0, 'd');
    date.add(months  || 0, 'M');
    date.add(years   || 0, 'y');
    date.add(hours   || 0, 'h');
    date.add(minutes || 0, 'm');
    date.add(seconds || 0, 's');

    return date.toISOString();
};

module.exports = new Helper();