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


show tables;

select * from teachers;
select * from users;
select * from students;
select * from payments;

desc students;
desc payments;
desc teachers;
desc users;

SET SQL_SAFE_UPDATES = 0;

DELETE FROM payments;
DELETE FROM students;

ALTER TABLE payments AUTO_INCREMENT = 1;
ALTER TABLE students AUTO_INCREMENT = 1;

SET SQL_SAFE_UPDATES = 1;


ALTER TABLE users ADD UNIQUE (phone);
ALTER TABLE users ADD UNIQUE (email);

ALTER TABLE students
ADD reminder_count INT DEFAULT 0;

INSERT INTO students
(name,mob_no,subjects,total_fee,due_date,parent_name,email,fee_mode,payment_mode,class_no,upi_id,reminder_count)
VALUES

('Rahul Sharma','9876543210','Maths',25000,5,'Ramesh Sharma','rahul1@gmail.com','Monthly','Online',10,'rahul@upi',0),
('Priya Reddy','9123456780','Science',22000,10,'Suresh Reddy','priya2@gmail.com','Monthly','Offline',9,NULL,0),
('Arjun Kumar','9988776655','English',18000,15,'Raj Kumar','arjun3@gmail.com','Quarterly','Online',8,'arjun@upi',0),
('Sneha Rao','9012345678','Physics',26000,5,'Mahesh Rao','sneha4@gmail.com','Monthly','Offline',10,NULL,0),
('Vikram Patel','9345678123','Chemistry',24000,10,'Ravi Patel','vikram5@gmail.com','Monthly','Online',9,'vikram@upi',0),

('Megha Das','9871203456','Biology',23000,15,'Sunil Das','megha6@gmail.com','Quarterly','Offline',8,NULL,0),
('Kiran Yadav','9812345670','Maths',25000,5,'Naresh Yadav','kiran7@gmail.com','Monthly','Online',10,'kiran@upi',0),
('Divya Singh','9345612780','Science',22000,10,'Ajit Singh','divya8@gmail.com','Monthly','Offline',9,NULL,0),
('Rohan Gupta','9765432109','English',18000,15,'Vijay Gupta','rohan9@gmail.com','Quarterly','Online',8,'rohan@upi',0),
('Pooja Jain','9098765432','Computer',27000,5,'Amit Jain','pooja10@gmail.com','Monthly','Offline',10,NULL,0),

('Ajay Verma','9871112233','Accounts',26000,10,'Rakesh Verma','ajay11@gmail.com','Monthly','Online',11,'ajay@upi',0),
('Neha Joshi','9122233445','Economics',24000,15,'Prakash Joshi','neha12@gmail.com','Quarterly','Offline',11,NULL,0),
('Sanjay Rao','9873344556','Maths',25000,5,'Mohan Rao','sanjay13@gmail.com','Monthly','Online',10,'sanjay@upi',0),
('Kavya Nair','9344455667','Chemistry',24000,10,'Hari Nair','kavya14@gmail.com','Monthly','Offline',9,NULL,0),
('Tarun Shah','9765566778','English',18000,15,'Ritesh Shah','tarun15@gmail.com','Quarterly','Online',8,'tarun@upi',0),

('Anjali Mehta','9876677889','Biology',23000,5,'Deepak Mehta','anjali16@gmail.com','Monthly','Offline',10,NULL,0),
('Manoj Kumar','9127788990','Physics',26000,10,'Ashok Kumar','manoj17@gmail.com','Monthly','Online',9,'manoj@upi',0),
('Rekha Devi','9988899001','History',21000,15,'Gopal Devi','rekha18@gmail.com','Quarterly','Offline',8,NULL,0),
('Nitin Rao','9011122233','Geography',22000,5,'Raman Rao','nitin19@gmail.com','Monthly','Online',10,'nitin@upi',0),
('Swathi Reddy','9342233445','Science',22000,10,'Murali Reddy','swathi20@gmail.com','Monthly','Offline',9,NULL,0),

('Harsha Kumar','9879988776','Political Science',23000,15,'Balu Kumar','harsha21@gmail.com','Quarterly','Online',12,'harsha@upi',0),
('Lavanya Singh','9128877665','Maths',25000,5,'Tej Singh','lavanya22@gmail.com','Monthly','Offline',10,NULL,0),
('Siddharth Jain','9987766554','Commerce',26000,10,'Nakul Jain','sid23@gmail.com','Monthly','Online',11,'sid@upi',0),
('Bhavana Rao','9016655443','English',18000,15,'Srinivas Rao','bhavana24@gmail.com','Quarterly','Offline',8,NULL,0),
('Varun Patel','9345544332','Computer',27000,5,'Ketan Patel','varun25@gmail.com','Monthly','Online',10,'varun@upi',0),

('Nisha Gupta','9874433221','Economics',24000,10,'Anil Gupta','nisha26@gmail.com','Monthly','Offline',11,NULL,0),
('Yash Sharma','9123322110','Physics',26000,15,'Rajesh Sharma','yash27@gmail.com','Quarterly','Online',9,'yash@upi',0),
('Deepa Nair','9982211009','Maths',25000,5,'Sajith Nair','deepa28@gmail.com','Monthly','Offline',10,NULL,0),
('Ritu Verma','9011100998','Chemistry',24000,10,'Madan Verma','ritu29@gmail.com','Monthly','Online',9,'ritu@upi',0),
('Akash Das','9340099887','Biology',23000,15,'Ranjan Das','akash30@gmail.com','Quarterly','Offline',8,NULL,0);

INSERT INTO payments (student_id, amount, payment_mode, RRN_no, date, upi_id)
VALUES

(1, 1500, 'Online', 900001201, '2026-03-02 10:15:00', 'ananya@upi'),
(2, 2500, 'Offline', NULL, '2026-03-03 11:00:00', NULL),
(3, 25000, 'Online', 900001203, '2026-03-05 09:30:00', 'rahul@upi'),
(33, 30000, 'Offline', NULL, '2026-03-06 12:20:00', NULL),
(34, 5000, 'Online', 900001205, '2026-03-08 08:45:00', 'aanshi@upi'),
(35, 20000, 'Offline', NULL, '2026-03-10 02:10:00', NULL),
(36, 5998, 'Online', 900001207, '2026-03-12 04:00:00', 'hasya@upi'),

(4, 13000, 'Online', 900001208, '2026-03-13 10:40:00', 'sneha@upi'),
(5, 24000, 'Offline', NULL, '2026-03-14 11:50:00', NULL),
(6, 10000, 'Online', 900001209, '2026-03-15 01:15:00', 'megha@upi'),
(7, 25000, 'Offline', NULL, '2026-03-16 03:30:00', NULL),
(8, 11000, 'Online', 900001210, '2026-03-17 05:00:00', 'divya@upi'),
(9, 18000, 'Offline', NULL, '2026-03-18 09:20:00', NULL),
(10, 13500, 'Online', 900001211, '2026-03-19 12:10:00', 'pooja@upi'),
(11, 26000, 'Offline', NULL, '2026-03-20 02:25:00', NULL);


ALTER TABLE teachers
ADD CONSTRAINT fk_teacher_user
FOREIGN KEY (email)
REFERENCES users(email)
ON DELETE CASCADE
ON UPDATE CASCADE;