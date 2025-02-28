CREATE TABLE IF NOT EXISTS courses (
    id INT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.0
);
