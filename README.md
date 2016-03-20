# SQML - Standard Query Markup Language

*SQML* is a Markup Languagem that helps you generate meaningful data to your database. It reads a .sqml file and outputs your data in ANSI SQL.

## Markup Language

Generating SQLs with SQML is extremely easy, you just need to create a .sqml file and define how the data on your table will look like.

You can write how many descriptors you want in your .sqml files. Each descriptor is defined with following the syntax

```
<table_name> {
    <column_name>: value,
    <column_name>: value,
    ...
} [* quantity];
```

where `value` can be any of the supported basic data (`number` or `string`) or one of the helper methods. While `quantity` is an `integer` and, surprisingly, represents the amount of records that will be created for that table.

> `quantity` is an optional field, if you do not define it, it will have the default value `1`.

Let's see an example

```
User {
    id: uuid(),
    name: 'Foo Bar',
    age: random(18, 24)
} * 4;
```

This descriptor will generate the following SQL

```sql
INSERT INTO User (id, name, age) VALUES
('50cb68e0-ee15-11e5-b578-654ad19c5815', 'Foo Bar', 21),
('50cb8ff0-ee15-11e5-b578-654ad19c5815', 'Foo Bar', 24),
('50cb8ff1-ee15-11e5-b578-654ad19c5815', 'Foo Bar', 18),
('50cb8ff2-ee15-11e5-b578-654ad19c5815', 'Foo Bar', 20);
```

> Note that SQML **only generates INSERT queries**. We assume that you already have your database configured.

## Compiling your SQML
To compile you SQML into SQL, you just need to execute the following command

```sh
node sqmlc.js ./samples/basic.sqml ./samples/basic.out.sql
```

## Helper Methods
### uuid([version='v1'])
*uuid* returns an UUID using the version provided as parameter. The available values are `v1` and `v4`.

```javascript
uuid('v4')
```

### sequence(id[, startsAt=0])
*sequence* returns the next integer value of the sequence identified by the `id`. An integer value can also be used to define the first value of the sequence.

```javascript
sequence('clientId', 1)
```

### random(min, max)
*random* returns a random integer number between `min` and `max`. Both limits are inclusive.

```javascript
random(-4, 4)
```

### date([date][, format]])
*date* is an alias to moment.js constructor. It returns the created date as an ISO String.

For more information, please refer to [moment.js docs](http://momentjs.com/docs/#/parsing/).

```javascript
date('20160325')
```

### relativeDate([days=0][, months=0][, years=0][, hours=0][, minutes=0][, seconds=0])
*relativeDate* is another helper method that deals with dates, but instead of creating an exact Date, it creates a Date based on `new Date()` and the supplied parameters.

For example, if today is 03/19/2016, calling *relativeDate* like this
```javascript
relativeDate(1,0,-1)
```
will return the date 03/20/2015

### fullName([gender])

Combines `firstName` with `lastName` and returns a first name and a last name separated by a space. Accepts the name gender, for more detail look at `firstName` documentation.

```javascript
fullName('F')
```

### firstName([gender])

Returns a random first name. The parameter `gender` defines the expected gender or the name. It can be either `M` or `F`, any other value will return names from both genders.

```javascript
firstName('M')
```

### lastName()

Returns a random last name.

```javascript
lastName()
```

## Author
SQML is a project made by Higgor Leimig.

## License
This project is under the MIT license and can be use in comercial or personal projects without restrictions. Just consider contributing your improvements back.