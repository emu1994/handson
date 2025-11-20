INSERT INTO beneficiaries (name, bank_name, branch_name, account_number, account_type) VALUES
('株式会社フロー', '三菱UFJ銀行', '新宿支店', '1234567', 'CURRENT'),
('田中商事', '三井住友銀行', '池袋支店', '7654321', 'CURRENT'),
('合同会社ブルー', 'みずほ銀行', '渋谷支店', '9988776', 'SAVINGS');

INSERT INTO transfer_orders (beneficiary_id, amount, scheduled_date, status, description) VALUES
(1, 1500000.00, '2025-11-15', 'PENDING', '11月分外注費'),
(2, 800000.00, '2025-11-14', 'EXECUTED', '仕入代金'),
(3, 350000.00, '2025-11-20', 'PENDING', '広告代理店手数料');
