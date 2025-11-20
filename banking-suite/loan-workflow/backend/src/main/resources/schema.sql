DROP TABLE IF EXISTS loan_applications;

CREATE TABLE loan_applications (
    id                SERIAL PRIMARY KEY,
    applicant_name    VARCHAR(100) NOT NULL,
    birth_date        DATE         NOT NULL,
    annual_income     NUMERIC(15,2) NOT NULL,
    requested_amount  NUMERIC(15,2) NOT NULL,
    term_months       INTEGER      NOT NULL,
    status            VARCHAR(20)  NOT NULL,
    score             INTEGER,
    remark            VARCHAR(255)
);
