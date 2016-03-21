CREATE TABLE User (
    id CHAR(32) PRIMARY KEY,
    firstname VARCHAR(120),
    lastname VARCHAR(120),
    age INT
);

CREATE TABLE Job (
    trackingNumber INT PRIMARY KEY,
    createdDate DATE,
    requester CHAR(32) REFERENCES User(id)
);