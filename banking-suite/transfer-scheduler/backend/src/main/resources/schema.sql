DROP TABLE IF EXISTS transfer_orders;
DROP TABLE IF EXISTS beneficiaries;

CREATE TABLE beneficiaries (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    bank_name       VARCHAR(80)  NOT NULL,
    branch_name     VARCHAR(80)  NOT NULL,
    account_number  VARCHAR(32)  NOT NULL,
    account_type    VARCHAR(20)  NOT NULL
);

CREATE TABLE transfer_orders (
    id              SERIAL PRIMARY KEY,
    beneficiary_id  INTEGER       NOT NULL REFERENCES beneficiaries(id),
    amount          NUMERIC(15,2) NOT NULL,
    scheduled_date  DATE          NOT NULL,
    status          VARCHAR(20)   NOT NULL,
    description     VARCHAR(255)
);
