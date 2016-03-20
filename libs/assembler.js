var Helper = require('./helper');

// Assembler definition
function Assembler() {

}

Assembler.prototype.exec = function(descriptors) {
    var ret = [];

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
                if (typeof property.value === 'object') {
                    values += Helper.get(property.value.name, property.value.args);

                } else if (typeof property.value === 'string') {
                    values += "'" + property.value + "'";

                } else {
                    values += property.value;
                }

                values += ", "
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

module.exports = Assembler;