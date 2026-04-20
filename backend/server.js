const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../Frontend")));

const studentRoutes = require("./routes/studentRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reportRoutes = require("./routes/reportRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const teacherRoutes = require("./routes/teacherRoutes");

app.use("/", studentRoutes);
app.use("/", paymentRoutes);
app.use("/", reportRoutes);
app.use("/", uploadRoutes);
app.use("/", teacherRoutes);

require("./whatsappReminder");

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});