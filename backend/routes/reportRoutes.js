const express = require("express");
const router = express.Router();
const db = require("../db");
// REPORT
router.get("/report", (req, res) => {
    const sql = `
        SELECT
            s.id,
            s.name,
            s.mob_no,
            s.parent_name,
            s.class_no,
            s.subjects,
            s.total_fee,
            s.due_date,
            IFNULL(SUM(p.amount), 0) AS paid,
            GREATEST(s.total_fee - IFNULL(SUM(p.amount), 0), 0) AS remaining,
            CASE
                WHEN IFNULL(SUM(p.amount), 0) = s.total_fee THEN 'Paid'
                WHEN IFNULL(SUM(p.amount), 0) > s.total_fee THEN 'Extra Paid'
                WHEN IFNULL(SUM(p.amount), 0) = 0 THEN 'Pending'
                ELSE 'Partial'
            END AS fee_status,
            CASE
                WHEN MAX(p.date) IS NULL THEN 'No Payment Yet'
                WHEN DAY(MAX(p.date)) <= s.due_date THEN 'On Time Submitted'
                ELSE 'Paid Late'
            END AS payment_timing,
            DATE_FORMAT(MAX(p.date), '%Y-%m-%d') AS last_payment_date
        FROM students s
        LEFT JOIN payments p
        ON s.id = p.student_id
        GROUP BY s.id
        ORDER BY s.id DESC
    `;
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Database error");
        }
        res.json(result);
    });
});
module.exports = router;