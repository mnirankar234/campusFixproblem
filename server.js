const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;


// Read complaints
function getComplaints() {
    const data = fs.readFileSync("complaints.json");
    return JSON.parse(data);
}


// Save complaints
function saveComplaints(complaints) {
    fs.writeFileSync(
        "complaints.json",
        JSON.stringify(complaints, null, 2)
    );
}


// Test backend
app.get("/", (req, res) => {
    res.send("CampusFix Backend is Running");
});


// Get all complaints
app.get("/complaints", (req, res) => {

    const complaints = getComplaints();

    res.json(complaints);
});


// Add complaint
app.post("/complaints", (req, res) => {

    const complaints = getComplaints();

    const newComplaint = {
        id: Date.now(),

        title: req.body.title,

        category: req.body.category,

        location: req.body.location,

        priority: req.body.priority,

        description: req.body.description,

        status: "Pending"
    };


    // Duplicate detection
    const duplicate = complaints.find((complaint) => {

        return (
            complaint.category === newComplaint.category &&
            complaint.location.toLowerCase() ===
            newComplaint.location.toLowerCase() &&
            complaint.status !== "Resolved"
        );

    });


    if (duplicate) {

        return res.json({
            success: false,

            duplicate: true,

            message:
                "A similar complaint already exists.",

            existingComplaint: duplicate
        });
    }


    complaints.push(newComplaint);

    saveComplaints(complaints);


    res.json({
        success: true,

        message: "Complaint submitted successfully.",

        complaint: newComplaint
    });

});


// Admin login
app.post("/admin-login", (req, res) => {

    const username = req.body.username;

    const password = req.body.password;


    // Simple demo login
    if (
        username === "admin" &&
        password === "1234"
    ) {

        res.json({
            success: true,
            message: "Login successful"
        });

    } else {

        res.json({
            success: false,
            message: "Wrong username or password"
        });

    }

});


// Update complaint status
app.put("/complaints/:id", (req, res) => {

    const complaints = getComplaints();

    const id = Number(req.params.id);

    const complaint = complaints.find(
        (c) => c.id === id
    );


    if (!complaint) {

        return res.json({
            success: false,
            message: "Complaint not found"
        });

    }


    complaint.status = req.body.status;

    saveComplaints(complaints);


    res.json({
        success: true,
        message: "Status updated",
        complaint: complaint
    });

});


app.listen(PORT, () => {

    console.log(
        `CampusFix backend running at http://localhost:${PORT}`
    );

});