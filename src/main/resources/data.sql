-- Добавляем продукты
INSERT INTO product (id, name, description, price) VALUES
(1, 'Кофе', 'Эфиопская Арабика, 1 кг', 25.0),
(2, 'Чай', 'Зеленый чай, 500 г', 15.0),
(3, 'Молоко', 'Цельное молоко, 1 л', 1.2);

-- Добавляем запасы
INSERT INTO inventory (id, product_id, quantity) VALUES
(1, 1, 50),
(2, 2, 30),
(3, 3, 100);