const express = require("express");
const router = express.Router();
const db = require("../db");
// ======================================
// ADD PAYMENT
// ======================================
router.post("/add-payment", (req, res) => {
    const { student_id, amount, payment_mode, RRN_no, upi_id, payment_date } = req.body;
    // Required fields
    if (!student_id || !payment_mode || !payment_date || amount == null) {
        return res.status(400).send("Missing required fields");
    }
    // Amount validation
    if (amount <= 0) {
        return res.status(400).send("Invalid amount");
    }
    // Online payment validation
    if (payment_mode.toLowerCase() === "online") {
        if (!upi_id || upi_id.trim() === "") {
            return res.status(400).send("UPI ID required for online payment");
        }
        if (!RRN_no || RRN_no.toString().trim() === "") {
            return res.status(400).send("RRN Number required for online payment");
        }
    }
    // ======================================
    // CHECK DUPLICATE RRN
    // ======================================
    if (RRN_no && RRN_no.toString().trim() !== "") {
        db.query(
            "SELECT id FROM payments WHERE RRN_no = ? LIMIT 1",
            [RRN_no],
            (checkErr, checkResult) => {
                if (checkErr) {
                    console.log(checkErr);
                    return res.status(500).send("Database error");
                }
                if (checkResult.length > 0) {
                    return res.status(400).json({
                        message: "Payment already exists"
                    });
                }
                insertPayment();
            }
        );
    } else {
        insertPayment();
    }
    // ======================================
    // INSERT PAYMENT FUNCTION
    // ======================================
    function insertPayment() {
        const sql = `
            INSERT INTO payments
            (student_id, amount, payment_mode, RRN_no, upi_id, date)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(
            sql,
            [
                student_id,
                amount,
                payment_mode,
                RRN_no || null,
                payment_mode.toLowerCase() === "online" ? upi_id : "",
                payment_date
            ],
            (err) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Database error");
                }
                res.status(200).json({
                    message: "Payment added successfully"
                });
            }
        );
    }
});
// ======================================
// GET ALL PAYMENTS
// ======================================
router.get("/payments", (req, res) => {
    const sql = `
        SELECT
            p.id,
            s.name,
            s.mob_no,
            p.amount,
            p.payment_mode,
            p.RRN_no,
            p.upi_id,
            DATE_FORMAT(p.date, '%Y-%m-%d') AS payment_date,
            CASE
                WHEN DAY(p.date) <= s.due_date
                THEN 'On Time Submitted'
                ELSE 'Paid Late'
            END AS payment_status
        FROM payments p
        JOIN students s
        ON p.student_id = s.id
        ORDER BY p.id DESC
    `;
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Database error");
        }
        res.json(result);
    });
});
// ======================================
// GET PAYMENTS OF ONE STUDENT
// ======================================
router.get("/payments/:id", (req, res) => {
    const sql = `
        SELECT
            p.id,
            p.student_id,
            p.amount,
            p.payment_mode,
            p.RRN_no,
            p.upi_id,
            DATE_FORMAT(p.date, '%Y-%m-%d') AS payment_date,
            CASE
                WHEN DAY(p.date) <= s.due_date
                THEN 'On Time Submitted'
                ELSE 'Paid Late'
            END AS payment_status
        FROM payments p
        JOIN students s
        ON p.student_id = s.id
        WHERE p.student_id = ?
        ORDER BY p.date DESC
    `;
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Database error");
        }
        res.json(result);
    });
});
module.exports = router;