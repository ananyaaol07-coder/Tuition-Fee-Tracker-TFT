const cron = require("node-cron");
const db = require("./db");
// Daily at 8:30 AM
cron.schedule("03 11 * * *", () => {
    console.log("Checking pending fees...");
    db.query(`
        SELECT
            s.id,
            s.name,
            s.mob_no,
            s.total_fee,
            s.due_date,
            IFNULL(SUM(p.amount),0) AS paid,
            (s.total_fee - IFNULL(SUM(p.amount),0)) AS pending_fee
        FROM students s
        LEFT JOIN payments p
        ON s.id = p.student_id
        GROUP BY s.id
        HAVING pending_fee > 0
        AND due_date <= DAY(CURDATE())
    `, (err, results) => {
        if (err) {
            console.log(err);
            return;
        }
        const today = new Date().getDate();
        results.forEach(student => {
            const daysLate = today - student.due_date;
            // Every 2 days only
            if (daysLate % 2 === 0) {
                const msg = `Hello ${student.name}, your pending fee of ₹${student.pending_fee} is still due. Kindly pay soon.`;
                const url = `https://wa.me/91${student.mob_no}?text=${encodeURIComponent(msg)}`;
                console.log("Reminder Sent To:", student.name);
                console.log(url);
            }
        });
    });
});