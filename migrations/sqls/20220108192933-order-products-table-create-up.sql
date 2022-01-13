CREATE TABLE IF NOT EXISTS order_products(
    order_id SERIAL REFERENCES orders(id) NOT NULL,
    product_id SERIAL REFERENCES products(id) NOT NULL,
    qty INTEGER NOT NULL
);