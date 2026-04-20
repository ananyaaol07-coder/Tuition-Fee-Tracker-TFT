CREATE DATABASE fee_system;
USE fee_system;

CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    phone VARCHAR(15),
    course VARCHAR(50),
    total_fee INT
);

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    amount INT,
    payment_mode VARCHAR(20),
    transaction_id VARCHAR(100),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id)
);

CREATE TABLE teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    t_name VARCHAR(100),
    mob_no VARCHAR(10),
    email VARCHAR(100),
    due_date INT
);

CREATE TABLE users (
 id INT AUTO_INCREMENT PRIMARY KEY,
 fullname VARCHAR(100),
 phone VARCHAR(20),
 email VARCHAR(100),
 password VARCHAR(100)
);

desc students;

show tables;

select * from teachers;
select * from users;
