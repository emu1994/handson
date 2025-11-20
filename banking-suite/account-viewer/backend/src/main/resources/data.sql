INSERT INTO accounts (account_number, holder_name, account_type, balance) VALUES
('1234567', '吉永 歩', 'SAVINGS', 3500000.00),
('7654321', '吉永 歩', 'CURRENT', 1200000.00),
('5558888', '株式会社YAY', 'CORPORATE', 9800000.00);

INSERT INTO transactions (account_id, occurred_at, type, amount, description) VALUES
(1, '2025-11-10 09:15:00', 'DEPOSIT',    250000.00, '給与振込'),
(1, '2025-11-11 12:30:00', 'WITHDRAWAL',  15000.00, 'コンビニATM出金'),
(1, '2025-11-12 19:20:00', 'WITHDRAWAL',   5200.00, 'スーパー買い物'),
(1, '2025-11-13 08:05:00', 'DEPOSIT',     30000.00, '立替精算'),

(2, '2025-11-09 14:00:00', 'DEPOSIT',    500000.00, '売上入金'),
(2, '2025-11-10 16:45:00', 'WITHDRAWAL', 120000.00, 'カード引き落とし'),
(2, '2025-11-11 10:15:00', 'WITHDRAWAL',  80000.00, '家賃振込'),

(3, '2025-11-08 09:00:00', 'DEPOSIT',   5000000.00, '請負開発入金'),
(3, '2025-11-09 09:10:00', 'WITHDRAWAL', 800000.00, '外注費支払'),
(3, '2025-11-10 09:20:00', 'WITHDRAWAL', 350000.00, 'AWS利用料');
