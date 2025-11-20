DROP TABLE IF EXISTS cashflow;
DROP TABLE IF EXISTS accounts;

CREATE TABLE accounts (
    id              SERIAL PRIMARY KEY,
    bank_name       VARCHAR(80)  NOT NULL,
    account_number  VARCHAR(32)  NOT NULL UNIQUE,
    account_type    VARCHAR(20)  NOT NULL,
    balance         NUMERIC(15,2) NOT NULL
);

CREATE TABLE cashflow (
    id              SERIAL PRIMARY KEY,
    account_id      INTEGER       NOT NULL REFERENCES accounts(id),
    date            DATE          NOT NULL,
    inflow          NUMERIC(15,2) NOT NULL,
    outflow         NUMERIC(15,2) NOT NULL,
    description     VARCHAR(255)
);
