DROP TABLE IF EXISTS holdings;
DROP TABLE IF EXISTS funds;

CREATE TABLE funds (
    id          SERIAL PRIMARY KEY,
    code        VARCHAR(20)  NOT NULL UNIQUE,
    name        VARCHAR(120) NOT NULL,
    asset_class VARCHAR(40)  NOT NULL,
    risk_level  VARCHAR(20)  NOT NULL,
    currency    VARCHAR(10)  NOT NULL
);

CREATE TABLE holdings (
    id             SERIAL PRIMARY KEY,
    fund_id        INTEGER       NOT NULL REFERENCES funds(id),
    units          NUMERIC(15,4) NOT NULL,
    average_price  NUMERIC(15,4) NOT NULL,
    latest_nav     NUMERIC(15,4) NOT NULL,
    valuation_date DATE          NOT NULL
);
