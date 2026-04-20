const express = require("express");
const router = express.Router();
const db = require("../db");
/* SIGNUP */
router.post("/signup", (req, res) => {
    const { fullname, phone, email, password } = req.body;
    db.query("SELECT * FROM users WHERE phone=?", [phone], (err1, phoneRows) => {
        if (err1) {
            return res.status(500).json({ message: "Server Error" });
        }
        if (phoneRows.length > 0) {
            return res.status(400).json({
                message: "Phone number already registered"
            });
        }
        db.query("SELECT * FROM users WHERE email=?", [email], (err2, emailRows) => {
            if (err2) {
                return res.status(500).json({ message: "Server Error" });
            }
            if (emailRows.length > 0) {
                return res.status(400).json({
                    message: "Email already registered"
                });
            }
            db.query(
                "INSERT INTO users(fullname,phone,email,password) VALUES(?,?,?,?)",
                [fullname, phone, email, password],
                (err3) => {
                    if (err3) {
                        return res.status(500).json({
                            message: "Registration Failed"
                        });
                    }
                    res.json({
                        message: "Signup Successful"
                    });
                });
        });
    });
});
/* CHECK USER */
router.get("/check-user", (req, res) => {
    const phone = req.query.phone;
    const email = req.query.email;
    db.query("SELECT * FROM users WHERE phone=?", [phone], (err1, phoneRows) => {
        if (err1) {
            return res.status(500).json({
                phoneExists: false,
                emailExists: false
            });
        }
        db.query("SELECT * FROM users WHERE email=?", [email], (err2, emailRows) => {
            if (err2) {
                return res.status(500).json({
                    phoneExists: false,
                    emailExists: false
                });
            }
            res.json({
                phoneExists: phoneRows.length > 0,
                emailExists: emailRows.length > 0
            });
        });
    });
});
/* LOGIN */
router.post("/login", (req, res) => {
    const { email, password } = req.body;
    db.query(
        "SELECT * FROM users WHERE email=? AND password=?",
        [email, password],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Server Error"
                });
            }
            if (result.length === 0) {
                return res.status(401).json({
                    message: "Invalid Login"
                });
            }
            const user = result[0];
            db.query(
                "SELECT * FROM teachers WHERE email=?",
                [email],
                (err2, rows) => {
                    if (err2) {
                        return res.status(500).json({
                            message: "Server Error"
                        });
                    }
                    if (rows.length === 0) {
                        db.query(
                            "INSERT INTO teachers(t_name,mob_no,email,due_date) VALUES(?,?,?,1)",
                            [user.fullname, user.phone, user.email]
                        );
                    }
                    res.json({
                        message: "Login Success",
                        user: user
                    });
                });
        });
});
module.exports = router;