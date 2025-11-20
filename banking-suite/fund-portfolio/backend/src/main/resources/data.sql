INSERT INTO funds (code, name, asset_class, risk_level, currency) VALUES
('FND1001', 'グローバル株式インデックス', 'EQUITY', 'HIGH', 'JPY'),
('FND2002', '世界債券インカム', 'BOND', 'MEDIUM', 'JPY'),
('FND3003', '先進国REITファンド', 'REIT', 'MEDIUM', 'JPY'),
('FND4004', 'コモディティ・バランス', 'COMMODITY', 'HIGH', 'USD');

INSERT INTO holdings (fund_id, units, average_price, latest_nav, valuation_date) VALUES
(1, 1200.5000, 15890.2500, 16540.7000, '2025-11-12'),
(2, 950.0000, 10250.0000, 10420.3500, '2025-11-12'),
(3, 640.7500, 8900.0000, 9150.1200, '2025-11-12'),
(4, 300.0000, 125.5000, 138.2000, '2025-11-12');
