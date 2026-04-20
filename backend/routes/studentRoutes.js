const express = require("express");
const router = express.Router();
const db = require("../db");
// MOBILE VALIDATION FUNCTION
function validateMobile(mob_no) {
    if (!mob_no || mob_no.trim() === "") {
        return "Mobile number must not be empty";
    }
    if (isNaN(mob_no)) {
        return "Enter numeric value only";
    }
    if (mob_no.length !== 10) {
        return "Mobile number must be of 10 digits";
    }
    if (!["6", "7", "8", "9"].includes(mob_no[0])) {
        return "Mobile number must start with 6, 7, 8, or 9";
    }
    return null;
}
// ===================================
// ADD STUDENT
// ===================================
router.post("/add-student", (req, res) => {
    const { name, mob_no, subjects, total_fee, due_date, parent_name, email, fee_mode, payment_mode, class_no, upi_id } = req.body;
    if (!name || !mob_no || !subjects || !total_fee || !due_date || !parent_name || !email || !fee_mode || !payment_mode || !class_no) {
        return res.status(400).send("All fields are required");
    }
    const mobileError = validateMobile(mob_no);
    if (mobileError) {
        return res.status(400).send(mobileError);
    }
    if (total_fee <= 0) {
        return res.status(400).send("Invalid fee");
    }
    if (due_date < 1 || due_date > 31) {
        return res.status(400).send("Due date must be between 1 and 31");
    }
    if (payment_mode.toLowerCase() === "online" && (!upi_id || upi_id.trim() === "")) {
        return res.status(400).send("UPI ID is required for online payment mode");
    }
    // ===================================
    // CHECK DUPLICATE STUDENT
    // Same name + mobile number
    // ===================================
    const checkSql = `
        SELECT id
        FROM students
        WHERE name = ? AND mob_no = ?
        LIMIT 1
    `;
    db.query(checkSql, [name, mob_no], (checkErr, checkResult) => {
        if (checkErr) {
            console.log(checkErr);
            return res.status(500).send("Database error");
        }
        if (checkResult.length > 0) {
            return res.status(400).json({
                message: "Student already exists"
            });
        }
        // ===================================
        // INSERT NEW STUDENT
        // ===================================
        const sql = `
            INSERT INTO students
            (name, mob_no, subjects, total_fee, due_date, parent_name, email, fee_mode, payment_mode, class_no, upi_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(sql, [
            name,
            mob_no,
            subjects,
            total_fee,
            due_date,
            parent_name,
            email,
            fee_mode,
            payment_mode,
            class_no,
            payment_mode.toLowerCase() === "online" ? upi_id : ""
        ], (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Database error");
            }
            res.status(200).json({
                message: "Student added successfully"
            });
        });
    });
});
// ===================================
// GET ALL STUDENTS
// ===================================
router.get("/students", (req, res) => {
    db.query("SELECT * FROM students ORDER BY id DESC", (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Database error");
        }
        res.json(result);
    });
});
// ===================================
// GET ONE STUDENT BY ID
// ===================================
router.get("/student/:id", (req, res) => {
    db.query("SELECT * FROM students WHERE id = ?", [req.params.id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Database error");
        }
        res.json(result);
    });
});
// ===================================
// UPDATE STUDENT
// ===================================
router.put("/student/:id", (req, res) => {
    const { name, mob_no, subjects, total_fee, due_date, parent_name, email, fee_mode, payment_mode, class_no, upi_id } = req.body;
    if (!name || !mob_no || !subjects || !total_fee || !due_date || !parent_name || !email || !fee_mode || !payment_mode || !class_no) {
        return res.status(400).send("All fields are required");
    }
    const mobileError = validateMobile(mob_no);
    if (mobileError) {
        return res.status(400).send(mobileError);
    }
    if (total_fee <= 0) {
        return res.status(400).send("Invalid fee");
    }
    if (due_date < 1 || due_date > 31) {
        return res.status(400).send("Due date must be between 1 and 31");
    }
    if (payment_mode.toLowerCase() === "online" && (!upi_id || upi_id.trim() === "")) {
        return res.status(400).send("UPI ID is required for online payment mode");
    }
    const sql = `
        UPDATE students
        SET name=?, mob_no=?, subjects=?, total_fee=?, due_date=?, parent_name=?, email=?, fee_mode=?, payment_mode=?, class_no=?, upi_id=?
        WHERE id=?
    `;
    db.query(sql, [
        name,
        mob_no,
        subjects,
        total_fee,
        due_date,
        parent_name,
        email,
        fee_mode,
        payment_mode,
        class_no,
        payment_mode.toLowerCase() === "online" ? upi_id : "",
        req.params.id
    ], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Update error");
        }
        res.status(200).json({
            message: "Student updated successfully"
        });
    });
});
module.exports = router;