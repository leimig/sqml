var uuid   = require('node-uuid');
var moment = require('moment');

/**
 * Helper is an object with an extensive list of
 * helper methods that generates random, but meaningful, data.
 */
function Helper() {
    this.sequences = {};
    this.names = {};

    this.names.male = [
        'William', 'Ernest', 'Emery', 'Jayson', 'Bob', 'Jeromy',
        'Augustus', 'Fermin', 'Mose', 'Pablo', 'Leonardo', 'Jeremiah',
        'Simon', 'Wilem', 'Tim', 'Tom', 'Cody', 'Adam'
    ];
  
    this.names.female = [
        'Adelle', 'Alycia', 'Cathryn', 'Shay', 'Beverly', 'Londa',
        'Kathryne', 'Ila', 'Mary', 'Carol', 'Ana', 'Amanda',
        'Maryrose', 'Lily', 'Robin', 'Auri', 'Fela', 'Mola'
    ];

    this.names.last = [
        'Smith', 'Brown', 'Johnson', 'Williams', 'Jones',
        'Davis', 'Miller', 'Wilson', 'Taylor', 'Clark',
        'Lewis', 'Harris', 'Thomas', 'Martin', 'Hall'
    ];

    this.names.both = this.names.male.concat(this.names.female);
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
    args = args || [];

    args.forEach(function(arg, index) {
        if (typeof arg === 'object') {
            argsv[index] = this.get(arg.name, arg.args);
        } else {
            argsv[index] = arg;
        }
    }.bind(this));

    var value;
    if (this[name]) {
        value = this[name].apply(this, argsv);
    } else {
        throw ReferenceError("Unknown helper method called `" + name + "`");
    }

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

/**
 * Combines `firstName` with `lastName`
 *
 * @param  {String} gender look `firstName` documentation
 * @return {String}        a first name and a last name separated by a space
 */
Helper.prototype.fullName = function(gender) {
    return this.firstName(gender) + ' ' + this.lastName();
};

/**
 * Returns a random first name based on the provided gender
 *
 * @param  {String} gender defines the expected gender or the name. It can be either
 *                         `M` or `F`, any other value will return names from both genders.
 * @return {String}
 */
Helper.prototype.firstName = function(gender) {
    if (gender === 'M') {
        return this.names.male[this.random(0, this.names.male.length-1)];

    } else if (gender === 'F') {
        return this.names.female[this.random(0, this.names.female.length-1)];

    } else {
        return this.names.both[this.random(0, this.names.both.length-1)];
    }
};

/**
 * Returns a random last name
 *
 * @return {String}
 */
Helper.prototype.lastName = function() {
    return this.names.last[this.random(0, this.names.last.length-1)];
};

module.exports = new Helper();