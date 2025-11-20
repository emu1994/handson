DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS accounts;

CREATE TABLE accounts (
    id              SERIAL PRIMARY KEY,
    account_number  VARCHAR(32)  NOT NULL UNIQUE,
    holder_name     VARCHAR(100) NOT NULL,
    account_type    VARCHAR(20)  NOT NULL,
    balance         NUMERIC(15,2) NOT NULL
);

CREATE TABLE transactions (
    id              SERIAL PRIMARY KEY,
    account_id      INTEGER       NOT NULL REFERENCES accounts(id),
    occurred_at     TIMESTAMP     NOT NULL,
    type            VARCHAR(20)   NOT NULL,
    amount          NUMERIC(15,2) NOT NULL,
    description     VARCHAR(255)
);
