DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS customers;

CREATE TABLE customers (
    id              SERIAL PRIMARY KEY,
    customer_code   VARCHAR(32)  NOT NULL UNIQUE,
    name            VARCHAR(100) NOT NULL,
    segment         VARCHAR(30)  NOT NULL,
    rating          VARCHAR(5)   NOT NULL,
    risk_score      INTEGER      NOT NULL,
    total_exposure  NUMERIC(15,2) NOT NULL
);

CREATE TABLE invoices (
    id              SERIAL PRIMARY KEY,
    customer_id     INTEGER      NOT NULL REFERENCES customers(id),
    invoice_number  VARCHAR(32)  NOT NULL UNIQUE,
    issue_date      DATE         NOT NULL,
    due_date        DATE         NOT NULL,
    amount          NUMERIC(15,2) NOT NULL,
    currency        VARCHAR(10)  NOT NULL,
    status          VARCHAR(20)  NOT NULL,
    days_overdue    INTEGER      NOT NULL,
    note            VARCHAR(255)
);
