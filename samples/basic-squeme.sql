CREATE TABLE User (
    id CHAR(32) PRIMARY KEY,
    name VARCHAR(120),
    age INT,
    birthday DATE
);

CREATE TABLE Job (
    trackingNumber INT PRIMARY KEY,
    createdDate DATE,
    endDate DATE,
    startDate DATE
);