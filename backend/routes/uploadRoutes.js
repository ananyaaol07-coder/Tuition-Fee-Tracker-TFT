const express = require("express");
const router = express.Router();
const multer = require("multer");
const xlsx = require("xlsx");
const fs = require("fs");
const db = require("../db");
const upload = multer({ dest: "uploads/" });
// Promise wrapper
function query(sql, values = []) {
    return new Promise((resolve, reject) => {
        db.query(sql, values, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}
// ==========================================
// UPLOAD STATEMENT
// Excel Format:
// Date | Description | Amount
// ==========================================
router.post("/upload-statement", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded");
    }
    const filePath = req.file.path;
    try {
        const workbook = xlsx.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = xlsx.utils.sheet_to_json(sheet);
        let inserted = 0;
        let skipped = 0;
        let unmatched = [];
        for (const row of rows) {
            // ==================================
            // DATE FIX (Excel serial -> MySQL date)
            // ==================================
            let paymentDate = row["Date"];
            if (typeof paymentDate === "number") {
                const excelDate = xlsx.SSF.parse_date_code(paymentDate);
                paymentDate =
                    excelDate.y +
                    "-" +
                    String(excelDate.m).padStart(2, "0") +
                    "-" +
                    String(excelDate.d).padStart(2, "0");
            }
            const descriptionRaw = row["Description"] || "";
            // ==================================
            // AMOUNT FIX
            // ==================================
            let amount = row["Amount"];
            amount = amount.toString().replace(/,/g, "").trim();
            amount = parseFloat(amount);
            const description = descriptionRaw.toString().toLowerCase().trim();
            // ==================================
            // VALIDATION
            // ==================================
            if (!paymentDate || !description || isNaN(amount) || amount <= 0) {
                skipped++;
                continue;
            }
            // ==================================
            // EXTRACT RRN
            // ==================================
            let rrnNo = "";
            const match = descriptionRaw.toString().match(/RRN\s*(\d+)/i);
            if (match) {
                rrnNo = match[1];
            } else {
                rrnNo = Math.floor(100000000 + Math.random() * 900000000);
            }
            // ==================================
            // MATCH STUDENT
            // ==================================
            const student = await query(`
                SELECT id
                FROM students
                WHERE
                ? LIKE CONCAT('%', LOWER(parent_name), '%')
                OR ? LIKE CONCAT('%', LOWER(upi_id), '%')
                OR ? LIKE CONCAT('%', LOWER(name), '%')
                LIMIT 1
            `, [description, description, description]);
            if (student.length === 0) {
                unmatched.push(descriptionRaw);
                skipped++;
                continue;
            }
            const studentId = student[0].id;
            // ==================================
            // DUPLICATE CHECK
            // ==================================
            const duplicate = await query(
                "SELECT id FROM payments WHERE RRN_no = ? LIMIT 1",
                [rrnNo]
            );
            if (duplicate.length > 0) {
                skipped++;
                continue;
            }
            // ==================================
            // INSERT PAYMENT
            // ==================================
            await query(`
                INSERT INTO payments
                (student_id, amount, payment_mode, RRN_no, upi_id, date)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [
                studentId,
                amount,
                "Online",
                rrnNo,
                "",
                paymentDate
            ]);
            inserted++;
        }
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        res.status(200).json({
            message: "Statement uploaded successfully",
            inserted: inserted,
            skipped: skipped,
            unmatched_rows: unmatched
        });
    } catch (error) {
        console.log(error);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        res.status(500).send(error.message);
    }
});
module.exports = router;