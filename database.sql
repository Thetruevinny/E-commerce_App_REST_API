-- Code used to create database with postbird.
CREATE TABLE products (
  id INT PRIMARY KEY,
  Name varchar(100) NOT NULL UNIQUE,
  Quantity INT,
  CHECK (Quantity >= 0)
);

CREATE TABLE users (
  id INT PRIMARY KEY,
  Name varchar(100) NOT NULL UNIQUE,
  Password varchar(100) NOT NULL,
  CHECK ( length(Password) > 5 )
);

CREATE TABLE orders (
  id INT PRIMARY KEY,
  UserId INT REFERENCES users(id),
  Total FLOAT NOT NULL
);

ALTER TABLE products 
ADD Price FLOAT;

CREATE TABLE orders_products (
  order_id INT REFERENCES orders(id),
  product_id INT REFERENCES products(id),
  quantity INT NOT NULL,
  PRIMARY KEY (order_id, product_id)
);

ALTER TABLE products
ADD category varchar(100);

INSERT INTO products (id, name, quantity, price, category)
VALUES 
(0, 'Blue t-shirt', 100, 5, 'Shirts'),
(1, 'Red t-shirt', 100, 5, 'Shirts'),
(3, 'Green t-shirt', 100, 5, 'Shirts'),
(4, 'Blue coat', 100, 5, 'Coats'),
(5, 'Red coat', 100, 5, 'Coats'),
(6, 'Jeans', 100, 5, 'Trousers'),
(7, 'Red Shorts', 100, 5, 'Shorts');

ALTER TABLE users
DROP CONSTRAINT users_password_check;

ALTER TABLE users
ADD CONSTRAINT password_length_check
CHECK (length(password) > 0);

ALTER TABLE users
ALTER COLUMN password TYPE text;

CREATE TABLE "session" (
    "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid");

CREATE INDEX "IDX_session_expire" ON "session" ("expire");