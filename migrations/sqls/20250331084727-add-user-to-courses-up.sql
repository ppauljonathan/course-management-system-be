ALTER TABLE IF EXISTS courses
ADD COLUMN user_id INT NOT NULL,
ADD CONSTRAINT fk_user
FOREIGN KEY(user_id)
REFERENCES users(id);
