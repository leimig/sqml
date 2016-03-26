var Helper = require('./helper');

// Assembler definition
function Assembler() {

}

Assembler.prototype.exec = function(descriptors) {
    var ret = [];
    var _this = this;

    descriptors.forEach(function(descriptor) {
        var query = "INSERT INTO %table% (%columns%) VALUES %values%;";

        // Set table name
        query = query.replace("%table%", descriptor.table);

        // Assemble column names
        var columns = "";
        descriptor.properties.forEach(function(property) {
            columns += property.name + ", ";
        });

        // .slice will remove the last comma
        query = query.replace("%columns%", columns.slice(0, -2));

        var valuesCompilation = "";
        // Generate values
        for (var i = 0; i < descriptor.quantity; i++) {
            var values = "(";

            descriptor.properties.forEach(function(property) {
                values += _this._resolveArgument(property.value) + ", ";
            });

            values = values.slice(0, -2) + "), ";
            valuesCompilation += values;
        }

        // .slice will remove the last comma
        query = query.replace("%values%", valuesCompilation.slice(0, -2));

        ret.push(query);
    });

    return ret;
};

Assembler.prototype._resolveArgument = function(argument) {
    if (typeof argument === 'object') {

        // if it's a method we will call the helper class
        if (argument.type === 'method') {
            return Helper.get(argument.name, argument.args);

        // if it's a query, than we will resolve its params
        } else if (argument.type === 'query') {
            var query = argument.query;
            var requiredParamsQuantity = (query.match(/%@/g) || []).length;

            // Validates the amount of query arguments required vs. provided
            if (requiredParamsQuantity !== argument.args.length) {
                throw Error("Wrong number of query arguments, expected " +
                    requiredParamsQuantity + " but found " + argument.args.length +
                    ". For query:\n" + query);
            }

            argument.args.forEach(function (arg) {
                query = query.replace('%@', this._resolveArgument(arg));
            }.bind(this));

            return '(' + query + ')';
        }

    // if it's a string, we just need to wrap it in quotes
    } else if (typeof argument === 'string') {
        return "'" + argument + "'";

    } else { // otherwise, just return the value
        return argument;
    }
};

module.exports = Assembler;